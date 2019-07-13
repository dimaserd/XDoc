using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Xdoc.Model.Entities;

namespace Xdoc.Model.Contexts
{
    public class XdocDbContext : ApplicationDbContext
    {
        public XdocDbContext(DbContextOptions options) : base(options)
        {
        }

        public const string ServerConnection = "ServerConnection";

        public const string LocalConnection = "DefaultConnection";

#if DEBUG
        public static string ConnectionString => LocalConnection;

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

        public DbSet<Client> Clients { get; set; }

        public DbSet<ClientDocument> ClientDocuments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            ClientDocument.OnModelCreating(modelBuilder);
            base.OnModelCreating(modelBuilder);
        }
    }
}
