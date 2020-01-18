using Croco.Core.Data.Implementations.DbAudit.Models;
using Croco.Core.EventSourcing.Implementations.StatusLog.Models;
using Croco.Core.Model.Entities;
using Croco.Core.Model.Entities.Store;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xdoc.Model.Entities;
using Zoo.Core;
using Zoo.Core.Abstractions;

namespace Xdoc.Model.Contexts
{
    public class XdocDbContext : ApplicationDbContext, IStoreContext
    {
        public XdocDbContext(DbContextOptions options) : base(options)
        {
        }

        public const string ServerConnection = "ServerConnection";

        public const string LocalConnection = "DefaultConnection";

#if DEBUG
        public static string ConnectionString => ServerConnection;

#else
        public static string ConnectionString => ServerConnection;
#endif

        public static XdocDbContext Create(IConfiguration configuration)
        {
            return Create(configuration.GetConnectionString(ConnectionString));
        }

        public static XdocDbContext Create(string connectionString)
        {
            var optionsBuilder = new DbContextOptionsBuilder<XdocDbContext>();
            optionsBuilder.UseSqlServer(connectionString);

            return new XdocDbContext(optionsBuilder.Options);
        }

        #region IStore
        public DbSet<RobotTask> RobotTasks { get; set; }

        public DbSet<LoggedUserInterfaceAction> LoggedUserInterfaceActions { get; set; }

        public DbSet<LoggedApplicationAction> LoggedApplicationActions { get; set; }

        public DbSet<AuditLog> AuditLogs { get; set; }

        public DbSet<IntegrationMessageLog> IntegrationMessageLogs { get; set; }

        public DbSet<IntegrationMessageStatusLog> IntegrationMessageStatusLogs { get; set; }

        public DbSet<WebAppRequestContextLog> WebAppRequestContextLogs { get; set; }
        #endregion


        public DbSet<Client> Clients { get; set; }

        public DbSet<ClientDocument> ClientDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ClientDocument.OnModelCreating(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }
    }
}
