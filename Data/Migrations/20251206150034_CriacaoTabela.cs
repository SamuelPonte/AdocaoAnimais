using Microsoft.EntityFrameworkCore.Migrations;

#nullable disable

namespace AdocaoAnimais_v1.Data.Migrations
{
    /// <inheritdoc />
    public partial class CriacaoTabela : Migration
    {
        /// <inheritdoc />
        protected override void Up(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Name",
                table: "SkinsTabela",
                newName: "Nome");
        }

        /// <inheritdoc />
        protected override void Down(MigrationBuilder migrationBuilder)
        {
            migrationBuilder.RenameColumn(
                name: "Nome",
                table: "SkinsTabela",
                newName: "Name");
        }
    }
}
