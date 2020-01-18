using Croco.Core.Abstractions.Data.Entities.HaveId;
using Croco.Core.Model.Models;

namespace Xdoc.Model.Entities
{
    public class Client : AuditableEntityBase, IHaveStringId
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
    }
}