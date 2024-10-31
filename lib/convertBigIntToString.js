function convertBigIntToString(obj) {
  if (typeof obj !== "object" || obj === null) {
    if (typeof obj === "string" && obj.startsWith("0x")) {
      return obj;
    }
    if (typeof obj === "bigint") {
      return obj.toString(10);
    }
    return obj;
  }

  if (Array.isArray(obj)) {
    return obj.map(convertBigIntToString);
  }

  return Object.fromEntries(
    Object.entries(obj).map(([key, value]) => [
      key,
      convertBigIntToString(value),
    ])
  );
}

export default convertBigIntToString;
