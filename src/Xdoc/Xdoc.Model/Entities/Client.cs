﻿using Croco.Core.Model.Interfaces.Auditable;
using Croco.Core.Model.Models;

namespace Xdoc.Model.Entities
{
    public class Client : AuditableEntityBase, IAuditableStringId
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }
    }
}