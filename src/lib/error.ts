export const error = (e: unknown) => {
  if (e instanceof TypeError) {
    console.error(e.message)
  } else {
    console.error(e)
  }
  process.exit(1)
}
