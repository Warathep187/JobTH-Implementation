import axios from "axios";
import requests from "../../src/app/libs/requests";

jest.mock("axios", () => ({
  defaults: {
    headers: {
      common: {}
    }
  },
  post: jest.fn()
}))

axios.post.mockResolvedValueOnce("CREATED_DATA");

describe('POST request', () => {
  it("created data", async () => {
    const url = "http://localhost:8080";
    const data = {}
    const createdData = await requests.post(url, data);
    expect(createdData).toBe("CREATED_DATA")
  })
})