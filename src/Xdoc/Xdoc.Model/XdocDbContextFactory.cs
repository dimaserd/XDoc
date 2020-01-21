using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Design;
using System;
using Xdoc.Model.Contexts;

namespace Xdoc.Model
{
    public class XdocDbContextFactory : IDesignTimeDbContextFactory<XdocDbContext>
    {
        private readonly string ServerConnectionString = "Server=ms-sql-9.in-solve.ru;Database=1gb_xdoc;Persist Security Info=True;Pooling=false;User ID=1gb_dimaserd;Password=add3835b723";
        public static readonly string LocalConnectionString = "Server=(localdb)\\mssqllocaldb;Database=aspnet-Xdoc-53bc9b9d-9d6a-45d4-8429-2a2761773502;Trusted_Connection=True;MultipleActiveResultSets=true";

        public XdocDbContext CreateDbContext(string[] args)
        {
            return XdocDbContext.Create(LocalConnectionString);
        }

        public void ExecuteCommand(string commandText)
        {
            using var db = CreateDbContext(null);
            using var command = db.Database.GetDbConnection().CreateCommand();
            command.CommandText = commandText;
            db.Database.OpenConnection();
            using var result = command.ExecuteReader();
            // do something with result
            Console.WriteLine(result.ToString());
        }
    }
}
