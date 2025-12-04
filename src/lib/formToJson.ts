export function formDataToJson(form: FormData) {
  return Object.fromEntries(
    Array.from(form.entries()).map(([key, value]) => [
      key,
      typeof value === "string" ? value : value.toString()
    ])
  );
}
