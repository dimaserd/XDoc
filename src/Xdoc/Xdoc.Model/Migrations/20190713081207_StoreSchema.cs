using System;
using Microsoft.EntityFrameworkCore.Metadata;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Xdoc.Model.Migrations
{
    public partial class StoreSchema : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.EnsureSchema(
                name: "Store");

            migrationBuilder.CreateTable(
                name: "LoggedApplicationAction",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    ActionDate = table.Column<DateTime>(nullable: false),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    IsException = table.Column<bool>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    IsInternal = table.Column<bool>(nullable: false),
                    Message = table.Column<string>(nullable: true),
                    StackTrace = table.Column<string>(nullable: true),
                    GroupName = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoggedApplicationAction", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "LoggedUserInterfaceAction",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<int>(nullable: false)
                        .Annotation("SqlServer:ValueGenerationStrategy", SqlServerValueGenerationStrategy.IdentityColumn),
                    LogDate = table.Column<DateTime>(nullable: false),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    IsException = table.Column<bool>(nullable: false),
                    GroupName = table.Column<string>(nullable: true),
                    Uri = table.Column<string>(nullable: false),
                    Description = table.Column<string>(nullable: true),
                    Message = table.Column<string>(nullable: true),
                    UserId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_LoggedUserInterfaceAction", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "Snapshot",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    EntityId = table.Column<string>(maxLength: 128, nullable: true),
                    TypeName = table.Column<string>(maxLength: 128, nullable: true),
                    SnapshotJson = table.Column<string>(nullable: true),
                    CreatedBy = table.Column<string>(maxLength: 128, nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Snapshot", x => x.Id);
                });
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "LoggedApplicationAction",
                schema: "Store");

            migrationBuilder.DropTable(
                name: "LoggedUserInterfaceAction",
                schema: "Store");

            migrationBuilder.DropTable(
                name: "Snapshot",
                schema: "Store");
        }
    }
}
