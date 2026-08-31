import { describe, expect, it } from "vitest";
import {
  GROUP_GAP,
  GROUP_HEADER_H,
  PANEL_BORDER_Y,
  ROW_H,
  getGroupHeight,
} from "./transaction-metrics";

describe("getGroupHeight", () => {
  it("một giao dịch: header + dòng + viền + khoảng cách", () => {
    expect(getGroupHeight(1)).toBe(GROUP_HEADER_H + ROW_H + PANEL_BORDER_Y + GROUP_GAP);
  });

  it("thêm một giao dịch thì cao thêm đúng một dòng", () => {
    for (const n of [1, 2, 5, 20]) {
      expect(getGroupHeight(n + 1) - getGroupHeight(n)).toBe(ROW_H);
    }
  });

  // Số đo thật lấy từ DOM: panel = 38 + 48n. Test này khoá lại con số đó để
  // lần sau đổi padding/viền là test gãy chứ không phải danh sách gãy.
  it("khớp chiều cao đo được trên DOM", () => {
    for (const [n, panelH] of [[3, 182], [4, 230], [6, 326], [8, 422]] as const) {
      expect(getGroupHeight(n) - GROUP_GAP).toBe(panelH);
    }
  });

  it("nhóm rỗng không âm và không tính đường kẻ", () => {
    expect(getGroupHeight(0)).toBe(GROUP_HEADER_H + PANEL_BORDER_Y + GROUP_GAP);
  });

  it("dòng đủ cao cho ngưỡng chạm 44px", () => {
    expect(ROW_H).toBeGreaterThanOrEqual(44);
  });
});
