import { readFile } from "fs/promises";

export async function getInputs(path: string, separator: string) {
  return (await readFile(path, 'utf-8')).split(separator).map(v => v.trim())
}
export async function getInputsWithWhitespace(path: string, separator: string ) {
  return (await readFile(path, 'utf-8')).split(separator)
}