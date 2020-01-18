using System;
using Microsoft.EntityFrameworkCore.Migrations;

namespace Xdoc.Model.Migrations
{
    public partial class UpdateCore : Migration
    {
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "Snapshot",
                schema: "Store");

            migrationBuilder.DropColumn(
                name: "IsInternal",
                schema: "Store",
                table: "LoggedApplicationAction");

            migrationBuilder.DropColumn(
                name: "CurrentSnapshotId",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "CurrentSnapshotId",
                table: "ClientDocuments");

            migrationBuilder.RenameColumn(
                name: "GroupName",
                schema: "Store",
                table: "LoggedUserInterfaceAction",
                newName: "ParametersJson");

            migrationBuilder.RenameColumn(
                name: "StackTrace",
                schema: "Store",
                table: "LoggedApplicationAction",
                newName: "ParametersJson");

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                schema: "Store",
                table: "LoggedUserInterfaceAction",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "EventId",
                schema: "Store",
                table: "LoggedApplicationAction",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "ExceptionStackTrace",
                schema: "Store",
                table: "LoggedApplicationAction",
                nullable: true);

            migrationBuilder.AddColumn<int>(
                name: "SeverityType",
                schema: "Store",
                table: "LoggedApplicationAction",
                nullable: false,
                defaultValue: 0);

            migrationBuilder.AddColumn<string>(
                name: "TransactionId",
                schema: "Store",
                table: "LoggedApplicationAction",
                maxLength: 128,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "Clients",
                rowVersion: true,
                nullable: true);

            migrationBuilder.AddColumn<byte[]>(
                name: "RowVersion",
                table: "ClientDocuments",
                rowVersion: true,
                nullable: true);

            migrationBuilder.CreateTable(
                name: "WebAppRequestContextLogs",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    UserId = table.Column<string>(nullable: true),
                    RequestId = table.Column<string>(nullable: true),
                    ParentRequestId = table.Column<string>(nullable: true),
                    Uri = table.Column<string>(nullable: true),
                    StartedOn = table.Column<DateTime>(nullable: false),
                    FinishedOn = table.Column<DateTime>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_WebAppRequestContextLogs", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "AuditLog",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    EntityName = table.Column<string>(nullable: true),
                    OperatedAt = table.Column<DateTime>(nullable: false),
                    OperatedBy = table.Column<string>(nullable: true),
                    KeyValues = table.Column<string>(nullable: true),
                    OldValues = table.Column<string>(nullable: true),
                    NewValues = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_AuditLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IntegrationMessageLog",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    MessageType = table.Column<string>(nullable: true),
                    MessageJson = table.Column<string>(nullable: true),
                    RequestId = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationMessageLog", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "RobotTask",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    CreatedBy = table.Column<string>(nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    LastModifiedOn = table.Column<DateTime>(nullable: true),
                    LastModifiedBy = table.Column<string>(nullable: true),
                    RowVersion = table.Column<byte[]>(rowVersion: true, nullable: true),
                    Script = table.Column<string>(nullable: true),
                    Result = table.Column<int>(nullable: false),
                    IsExecutionDelayed = table.Column<bool>(nullable: false),
                    ToExecuteOn = table.Column<DateTime>(nullable: false),
                    StartedOn = table.Column<DateTime>(nullable: true),
                    ExecutedOn = table.Column<DateTime>(nullable: true),
                    ExceptionStackTrace = table.Column<string>(nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_RobotTask", x => x.Id);
                });

            migrationBuilder.CreateTable(
                name: "IntegrationMessageStatusLog",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    HandlerId = table.Column<string>(maxLength: 128, nullable: true),
                    MessageId = table.Column<string>(nullable: true),
                    StartedOn = table.Column<DateTime>(nullable: false),
                    State = table.Column<int>(nullable: false)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_IntegrationMessageStatusLog", x => x.Id);
                    table.ForeignKey(
                        name: "FK_IntegrationMessageStatusLog_IntegrationMessageLog_MessageId",
                        column: x => x.MessageId,
                        principalSchema: "Store",
                        principalTable: "IntegrationMessageLog",
                        principalColumn: "Id",
                        onDelete: ReferentialAction.Restrict);
                });

            migrationBuilder.CreateIndex(
                name: "IX_IntegrationMessageStatusLog_MessageId",
                schema: "Store",
                table: "IntegrationMessageStatusLog",
                column: "MessageId");
        }

        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.DropTable(
                name: "WebAppRequestContextLogs");

            migrationBuilder.DropTable(
                name: "AuditLog",
                schema: "Store");

            migrationBuilder.DropTable(
                name: "IntegrationMessageStatusLog",
                schema: "Store");

            migrationBuilder.DropTable(
                name: "RobotTask",
                schema: "Store");

            migrationBuilder.DropTable(
                name: "IntegrationMessageLog",
                schema: "Store");

            migrationBuilder.DropColumn(
                name: "EventId",
                schema: "Store",
                table: "LoggedUserInterfaceAction");

            migrationBuilder.DropColumn(
                name: "EventId",
                schema: "Store",
                table: "LoggedApplicationAction");

            migrationBuilder.DropColumn(
                name: "ExceptionStackTrace",
                schema: "Store",
                table: "LoggedApplicationAction");

            migrationBuilder.DropColumn(
                name: "SeverityType",
                schema: "Store",
                table: "LoggedApplicationAction");

            migrationBuilder.DropColumn(
                name: "TransactionId",
                schema: "Store",
                table: "LoggedApplicationAction");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "Clients");

            migrationBuilder.DropColumn(
                name: "RowVersion",
                table: "ClientDocuments");

            migrationBuilder.RenameColumn(
                name: "ParametersJson",
                schema: "Store",
                table: "LoggedUserInterfaceAction",
                newName: "GroupName");

            migrationBuilder.RenameColumn(
                name: "ParametersJson",
                schema: "Store",
                table: "LoggedApplicationAction",
                newName: "StackTrace");

            migrationBuilder.AddColumn<bool>(
                name: "IsInternal",
                schema: "Store",
                table: "LoggedApplicationAction",
                nullable: false,
                defaultValue: false);

            migrationBuilder.AddColumn<string>(
                name: "CurrentSnapshotId",
                table: "Clients",
                nullable: true);

            migrationBuilder.AddColumn<string>(
                name: "CurrentSnapshotId",
                table: "ClientDocuments",
                nullable: true);

            migrationBuilder.CreateTable(
                name: "Snapshot",
                schema: "Store",
                columns: table => new
                {
                    Id = table.Column<string>(nullable: false),
                    CreatedBy = table.Column<string>(maxLength: 128, nullable: true),
                    CreatedOn = table.Column<DateTime>(nullable: false),
                    EntityId = table.Column<string>(maxLength: 128, nullable: true),
                    SnapshotJson = table.Column<string>(nullable: true),
                    TypeName = table.Column<string>(maxLength: 128, nullable: true)
                },
                constraints: table =>
                {
                    table.PrimaryKey("PK_Snapshot", x => x.Id);
                });
        }
    }
}
