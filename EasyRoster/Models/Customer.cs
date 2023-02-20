using System.ComponentModel.DataAnnotations;

namespace EasyRoster.Models
{
    public class Customer
    {
        [Key]
        public string Id { get; set; }
        //[RegularExpression(@"^[a-zA-Z''-'\s]{1,60}$",
        //ErrorMessage = "Characters are not allowed.")]
        public string FirstName { get; set; }

        //[RegularExpression(@"^[a-zA-Z''-'\s]{1,40}$",
        // ErrorMessage = "Characters are not allowed.")]
        public string Surname { get; set; }

        //[RegularExpression(@"^[0-9]{10,15}$",
        // ErrorMessage = "Characters are not allowed.")]
        public string Cellphone { get; set; }

        public string Email { get; set; }

        public double InvoiceTotal { get; set; }

        public string Type { get; set; }
    }
}
