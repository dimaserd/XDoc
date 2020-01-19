using Croco.Core.Abstractions.Data.Entities.HaveId;
using Croco.Core.Model.Abstractions.Entity;
using Croco.Core.Model.Models;

namespace Xdoc.Model.Entities
{
    public class Client : AuditableEntityBase, ICrocoUser
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string Name { get; set; }

        public string PhoneNumber { get; set; }
        public string Surname { get; set; }
        public string Patronymic { get; set; }
    }
}