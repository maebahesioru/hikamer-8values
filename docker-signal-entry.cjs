// Docker 停止時に即座に終了するためのエントリ（Dockerfile の CMD から使う）。
process.on("SIGTERM", () => process.exit(0));
process.on("SIGINT", () => process.exit(0));
require("./server.js");
