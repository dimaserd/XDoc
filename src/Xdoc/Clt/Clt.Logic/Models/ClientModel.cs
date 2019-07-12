using Xdoc.Model.Entities;

namespace Clt.Logic.Models
{
    public class ClientModel
    {
        public string Id { get; set; }

        public string Email { get; set; }

        public string PhoneNumber { get; set; }

        public static ClientModel ToClientModel(Client client)
        {
            return new ClientModel
            {
                Id = client.Id,
                Email = client.Email,
                PhoneNumber = client.PhoneNumber
            };
        }
    }
}
