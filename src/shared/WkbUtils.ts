import { BufferWriter, BufferReader } from "ginkgoch-buffer-io";

export default class WkbUtils {
    static writeByteEndian(writer: BufferWriter, bigEndian: boolean) {
        const be = bigEndian ? 0 : 1;
        writer.writeInt8(be);
    }

    static readByteEndian(reader: BufferReader) {
        return reader.nextInt8() === 0;
    }

    static writeDouble(writer: BufferWriter, n: number, bigEndian: boolean) {
        if (bigEndian) {
            writer.writeDoubleBE(n);
        } else {
            writer.writeDoubleLE(n);
        }
    }

    static readDouble(reader: BufferReader, bigEndian: boolean) {
        if (bigEndian) {
            return reader.nextDoubleBE();
        } else {
            return reader.nextDoubleLE();
        }
    }
}