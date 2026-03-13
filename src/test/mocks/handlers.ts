import { http, HttpResponse } from "msw";

export const handlers = [
  http.post("*/rest/v1/leads", () => {
    return HttpResponse.json({ id: "test-uuid" }, { status: 201 });
  }),
];
