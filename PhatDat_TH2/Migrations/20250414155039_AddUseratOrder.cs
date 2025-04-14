using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace PhatDat_TH2.Migrations
{
    public partial class AddUseratOrder : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            // Thêm cột UserId vào bảng Orders
            migrationBuilder.AddColumn<int>(
                name: "UserId",
                table: "Orders",
                type: "int",
                nullable: true); // nullable: true nếu bạn không yêu cầu giá trị không null

            // Tạo khóa ngoại giữa Orders và Users
            migrationBuilder.CreateIndex(
                name: "IX_Orders_UserId",
                table: "Orders",
                column: "UserId");

            migrationBuilder.AddForeignKey(
                name: "FK_Orders_Users_UserId",
                table: "Orders",
                column: "UserId",
                principalTable: "Users",
                principalColumn: "Id",
                onDelete: ReferentialAction.Cascade); // Tùy chỉnh hành động xóa khi người dùng bị xóa
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            // Xóa khóa ngoại và chỉ mục
            migrationBuilder.DropForeignKey(
                name: "FK_Orders_Users_UserId",
                table: "Orders");

            migrationBuilder.DropIndex(
                name: "IX_Orders_UserId",
                table: "Orders");

            // Xóa cột UserId khỏi bảng Orders
            migrationBuilder.DropColumn(
                name: "UserId",
                table: "Orders");
        }
    }
}
