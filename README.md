# ASP.NET Core Backend - Cửa hàng bán thực phẩm

Đây là dự án backend được xây dựng bằng **ASP.NET Core (.NET 6+)** cho hệ thống quản lý cửa hàng bán thực phẩm.  
Hệ thống hỗ trợ quản lý người dùng, sản phẩm, giỏ hàng, đơn hàng, tích hợp thanh toán và kết nối với frontend React.

---

## Công nghệ sử dụng
- ASP.NET Core Web API (hoặc MVC)  
- Entity Framework Core  
- SQL Server  
- JWT Authentication  
- RESTful API  

---

## Chức năng chính
- **Quản lý người dùng**: đăng ký, đăng nhập, quản lý hồ sơ, phân quyền.  
- **Quản lý sản phẩm**: thêm, sửa, xóa, tìm kiếm và hiển thị sản phẩm.  
- **Giỏ hàng**: thêm sản phẩm, cập nhật số lượng, xóa sản phẩm.  
- **Đơn hàng**: quy trình thanh toán, xử lý đơn hàng và theo dõi trạng thái.  
- **Trang quản trị (Admin Panel)**: quản lý danh mục, sản phẩm, người dùng và đơn hàng.  
- **Tích hợp thanh toán**: tích hợp **VNPay** cho giao dịch trực tuyến an toàn.  
- **Chatbox AI**: hỗ trợ người dùng và khách hàng trực tiếp trên hệ thống.  

---

## Yêu cầu cài đặt
- .NET 6 SDK hoặc cao hơn: [Tải tại đây](https://dotnet.microsoft.com/download)  
- Visual Studio 2022 hoặc VS Code (cài đặt C# extension)  
- SQL Server (hoặc SQLite cho cấu hình đơn giản)  

---

## Cách cài đặt và chạy dự án

### 1. Clone repository
```bash
	git clone https://github.com/nguyendat13/fruit-store.git

### 2. Di chuyển vào thư mục backend
	cd fruit-store

### 3. Khôi phục các package
	dotnet restore

### 4. Chạy migration và khởi tạo database
	dotnet ef database update

### 5. Chạy dự án
	dotnet run

Liên hệ

Nếu bạn có bất kỳ thắc mắc hoặc góp ý nào, vui lòng tạo issue hoặc liên hệ trực tiếp qua:

Email: dat48421@gmail.com

GitHub: nguyendat13
