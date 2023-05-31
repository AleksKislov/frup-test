export function endWithMsg(msg) {
  console.log(msg);
  process.exit(0);
}

// @ts-ignore
export function endWithErr(e) {
  console.log(e);
  process.exit(1);
}
