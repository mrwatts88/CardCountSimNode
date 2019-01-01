export function DEBUG(statement: string) {
  if (process.env.NODE_ENV === 'debug') console.info(statement)
}
