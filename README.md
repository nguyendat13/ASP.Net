# 🛒 ASP.NET Core Backend - Cửa hàng bán thực phẩm

Đây là dự án backend được xây dựng bằng ASP.NET Core (.NET 6+) cho hệ thống quản lý cửa hàng bán thực phẩm, hỗ trợ kết nối với frontend React.

## ✅ Công nghệ sử dụng

- ASP.NET Core Web API (hoặc MVC)
- Entity Framework Core
- SQL Server
- JWT Authentication
- RESTful API

---

## 🚀 Hướng dẫn cài đặt & chạy dự án

### 🔧 Yêu cầu

- [.NET 6 SDK trở lên](https://dotnet.microsoft.com/download)
- Visual Studio 2022+ hoặc VS Code với C# extension
- SQL Server (hoặc SQLite nếu dùng file DB)

### 📦 Cài đặt

```bash
# Clone repository
git clone https://github.com/your-username/your-repo.git

# Di chuyển vào thư mục backend
cd your-repo

# Restore các package cần thiết
dotnet restore


## 🧱 Chạy migration & khởi tạo database

```bash
# Tạo database (nếu chưa có)
dotnet ef database update

## ▶️ Chạy dự án

dotnet run

