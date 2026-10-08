"""Crop an 8-bit, non-interlaced RGB/RGBA PNG without any dependency.

macOS `sips --cropOffset` is ignored and crops from the centre, and PIL is not installed,
so this does the little that is needed: unfilter, slice, refilter with filter 0.
"""
from __future__ import annotations

import struct
import zlib


def _chunks(data: bytes):
    pos = 8
    while pos < len(data):
        length, kind = struct.unpack_from('>I4s', data, pos)
        yield kind, data[pos + 8 : pos + 8 + length]
        pos += 12 + length


def _paeth(a: int, b: int, c: int) -> int:
    p = a + b - c
    pa, pb, pc = abs(p - a), abs(p - b), abs(p - c)
    if pa <= pb and pa <= pc:
        return a
    return b if pb <= pc else c


def read(data: bytes) -> tuple[int, int, int, list[bytearray]]:
    """Return (width, height, bytes per pixel, rows)."""
    ihdr = next(c for k, c in _chunks(data) if k == b'IHDR')
    w, h, depth, ctype, _, _, interlace = struct.unpack('>IIBBBBB', ihdr)
    if depth != 8 or interlace != 0 or ctype not in (2, 6):
        raise ValueError(f'unsupported PNG: depth={depth} color={ctype} interlace={interlace}')
    bpp = 3 if ctype == 2 else 4
    raw = zlib.decompress(b''.join(c for k, c in _chunks(data) if k == b'IDAT'))
    stride = w * bpp
    rows: list[bytearray] = []
    prev = bytearray(stride)
    pos = 0
    for _ in range(h):
        f = raw[pos]
        line = bytearray(raw[pos + 1 : pos + 1 + stride])
        pos += 1 + stride
        if f == 1:
            for i in range(bpp, stride):
                line[i] = (line[i] + line[i - bpp]) & 255
        elif f == 2:
            for i in range(stride):
                line[i] = (line[i] + prev[i]) & 255
        elif f == 3:
            for i in range(stride):
                left = line[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + ((left + prev[i]) >> 1)) & 255
        elif f == 4:
            for i in range(stride):
                a = line[i - bpp] if i >= bpp else 0
                c = prev[i - bpp] if i >= bpp else 0
                line[i] = (line[i] + _paeth(a, prev[i], c)) & 255
        rows.append(line)
        prev = line
    return w, h, bpp, rows


def write(w: int, h: int, bpp: int, rows: list[bytearray]) -> bytes:
    def chunk(kind: bytes, body: bytes) -> bytes:
        return struct.pack('>I', len(body)) + kind + body + struct.pack('>I', zlib.crc32(kind + body) & 0xFFFFFFFF)

    ihdr = struct.pack('>IIBBBBB', w, h, 8, 2 if bpp == 3 else 6, 0, 0, 0)
    idat = zlib.compress(b''.join(b'\x00' + bytes(r) for r in rows), 9)
    return b'\x89PNG\r\n\x1a\n' + chunk(b'IHDR', ihdr) + chunk(b'IDAT', idat) + chunk(b'IEND', b'')


def crop(src: str, dst: str, left: int, top: int, width: int, height: int) -> tuple[int, int]:
    w, h, bpp, rows = read(open(src, 'rb').read())
    width = min(width, w - left)
    height = min(height, h - top)
    out = [r[left * bpp : (left + width) * bpp] for r in rows[top : top + height]]
    open(dst, 'wb').write(write(width, height, bpp, out))
    return width, height
