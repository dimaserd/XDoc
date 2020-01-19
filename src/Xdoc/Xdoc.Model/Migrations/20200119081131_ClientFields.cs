using Microsoft.EntityFrameworkCore.Migrations;

namespace Xdoc.Model.Migrations
{
    public partial class ClientFields : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.AddColumn<string>(
                name: "Name",
                table: "Clients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Patronymic",
                table: "Clients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "Surname",
                table: "Clients",
                nullable: true);
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropColumn(
                name: "Name",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Patronymic",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "Surname",
                table: "Clients");
        }
    }
}
