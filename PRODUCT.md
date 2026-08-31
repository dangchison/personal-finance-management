# Product

<!-- impeccable:product-schema 1 -->

## Platform

web

## Users

Người Việt muốn kiểm soát chi tiêu hằng ngày, dùng chủ yếu trên điện thoại (thỉnh thoảng PC). Hai vai: cá nhân tự theo dõi, và hộ gia đình gộp chi tiêu chung qua nhóm family với mã mời. Landing page nhắm người dùng công khai — người lạ cần tin và đăng ký (xác nhận từ user 2026-08-31).

## Product Purpose

Ghi chép giao dịch chi tiêu nhanh, đặt ngân sách theo danh mục, xem báo cáo xu hướng để biết tiền đi đâu và điều chỉnh thói quen. Thành công = người dùng ghi giao dịch đều mỗi ngày và giữ được ngân sách tháng.

## Positioning

Gọn và tiếng Việt thuần: nhập giao dịch trong vài giây với numpad và format nghìn tự động, tách bạch chi tiêu cá nhân / gia đình trong cùng một tài khoản (nhóm family bằng mã mời), hoàn toàn miễn phí, không cần thẻ tín dụng, không quảng cáo.

## Operating Context

Dùng nhiều lần trong ngày trên điện thoại (ghi chi tiêu ngay lúc phát sinh: ăn uống, di chuyển, chuyển khoản). Cuối tháng xem báo cáo trên PC hoặc điện thoại. Tiền tệ: VND (₫), định dạng 12.450.000 ₫. Múi giờ cố định UTC+7. Ngôn ngữ UI: tiếng Việt.

## Capabilities and Constraints

Có thật (đã chạy trên server):
- Ghi giao dịch cả tiền ra lẫn tiền vào (tiền mặt / chuyển khoản, kèm mã CK), nhóm theo ngày, danh sách virtualized, sửa và xoá được.
- Ngân sách theo danh mục, theo dõi % dùng theo thời gian thực, cảnh báo vượt.
- Báo cáo: donut phân bổ theo danh mục, dòng tiền theo ngày, xu hướng 6 tháng, năm nay so với năm ngoái; chọn theo tháng.
- Nhóm gia đình: tạo nhóm, mã mời, xem chi tiêu chung, lọc theo thành viên.
- Đăng ký/đăng nhập bằng credentials (email hoặc username), phân quyền admin quản lý danh mục hệ thống.
- Nền sáng / nền tối, theo hệ thống hoặc tự chọn.

Ràng buộc:
- Chưa có: recurring, ví/accounts, goals, export, PWA, OAuth. Không được nêu trên landing như tính năng đã có (landing đang liệt kê chúng ở mục "chưa làm", đúng sự thật).
- Stack: Next.js 16 App Router, Tailwind v4, shadcn/ui; dev port 3008.

## Brand Commitments

Tên hiển thị hiện tại: "Personal Finance Management" / logo tạm là icon Wallet. Chưa có logo, brandmark hay tên thương hiệu chính thức — open decision, landing được phép đặt cách thể hiện tên riêng nhưng không bịa pháp nhân.

## Evidence on Hand

- Sản phẩm thật đang chạy: dashboard, transactions, reports, family, settings (screenshot/mockup lấy từ chính app được).
- KHÔNG có: số lượng người dùng, testimonial, khách hàng, giải thưởng, press. Tuyệt đối không bịa các claim này trên landing.
- Số liệu minh hoạ dashboard (VND) được phép dựng và phải nhìn như dữ liệu Việt thật.

## Product Principles

1. Tốc độ ghi chép thắng mọi thứ — mỗi giây thêm vào flow nhập liệu là một giao dịch không được ghi.
2. Mobile trước, desktop sau — mọi quyết định layout xuất phát từ màn 375px và ngón cái.
3. Trung thực tuyệt đối về khả năng — không hứa tính năng chưa có, không bịa social proof.
4. Tiếng Việt và VND là mặc định, không phải bản dịch.
5. Miễn phí không kèm bẫy — không thu thập gì ngoài email, nói rõ điều đó.
