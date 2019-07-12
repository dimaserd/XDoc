using Croco.Core.Model.Interfaces.Auditable;
using Croco.Core.Model.Models;
using Microsoft.EntityFrameworkCore;
using System.ComponentModel.DataAnnotations.Schema;
using Xdoc.Model.Enumerations;

namespace Xdoc.Model.Entities
{
    public class ClientDocument : AuditableEntityBase, IAuditableComposedId
    {
        [ForeignKey(nameof(Client))]
        public string ClientId { get; set; }

        public virtual Client Client { get; set; }

        public ClientDocumentType Type { get; set; }

        public string DocumentJson { get; set; }

        public static void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<ClientDocument>()
                .HasKey(p => new { p.ClientId, p.Type });
        }

        public string GetComposedId()
        {
            return $"{nameof(ClientId)}={ClientId}&{nameof(Type)}={Type}";
        }
    }
}
