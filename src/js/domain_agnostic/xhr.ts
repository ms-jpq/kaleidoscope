const XHR = (req: "GET" | "PUT" | "POST" | "DELETE") => <T>(
  url: string,
) => async (body?: Record<string, number | string>) => {
  const res = await fetch(url, {
    method: req,
    body: body && JSON.stringify(body),
  })
  if (res.ok) {
    return res.json() as Promise<T>
  } else {
    throw new Error(`${res.status}`)
  }
}

export const GET = XHR("GET")
export const PUT = XHR("PUT")
export const POST = XHR("POST")
export const DELETE = XHR("DELETE")
