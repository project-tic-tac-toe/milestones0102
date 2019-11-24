let knex = require("../knexData").default;
//KIEM TRA TON TAI ID
module.exports.isCorrectId = async (id, table) => {
  return await knex(table)
    .where({ id: id })
    .select("*")
    .then(items => {
      if (items.length === 0) return false;
      else return true;
    });
};

//TIM GIA SAN PHAM
module.exports.getPrizeOfProduct = async (id, table) => {
  return await knex(table)
    .where({ id: id })
    .select("*")
    .then(items => {
      if (items.length !== 0) return parseInt(items[0].prize);
      else return 0;
    });
};
//Tim data with id of table
module.exports.getDataForTable = async (id, table) => {
  return await knex(table)
    .where({ id: id })
    .select("*")
    .then(items => {
      if (items.length !== 0) return items[0];
      else return null;
    });
};

module.exports.updatePrizeTotalForInvoice = arrInvoiceChange => {
  arrInvoiceChange.forEach(id => {
    let total = 0;
    let create_at = new Date();
    knex("invoices_detail_product")
      .where({ id_invoice: id })
      .select("total_product")
      .then(items => {
        if (items.length !== 0) {
          items.forEach(t => {
            total = total + parseInt(t.total_product);
          });
        }
      })
      .then(() => {
        knex("invoices_product")
          .where({ id })
          .update({
            total,
            create_at
          })
          .returning("id")
          .then(id => {
            if (id.length === 0) return false;
            else return true;
          });
      });
  });
};
// const clearNullInvoicesProduct = obj => {
//   let clean = {};
//   Object.keys(obj)
//     .filter(key => obj[key] !== null)
//     .forEach(item => {
//       clean[item] = obj[item];
//     });
//   return clean;
// };
const monthDiff=(d1, d2)=> {
  var months;
  months = (d2.getFullYear() - d1.getFullYear()) * 12;
  months -= d1.getMonth() + 1;
  months += d2.getMonth();
  return months <= 0 ? 0 : months;
}
module.exports.updatePrizeTotalForInvoiceRoom = arrInvoiceChange => {
  arrInvoiceChange.forEach(id => {
    let total = 0;
    let create_at = new Date();
    knex("invoices_detail_room")
      .where({ id_invoice: id })
      .select("total_room")
      .then(items => {
        if (items.length !== 0) {
          items.forEach(t => {
            total = total + parseInt(t.total_room);
          });
        }
      })
      .then(async () => {
        //tính số ngày ==> cộng tiền phòng==> tính 1 tháng ==>prize* tháng
        const data = await this.getDataForTable(id, "invoices_room").then(
          res => res
        );
        const prize=await this.getPrizeOfProduct(data.id_room, "rooms").then(res=>res);
        total = total + prize * monthDiff(data.date_arrival,data.date_department);
        knex("invoices_room")
          .where({ id })
          .update({
            total,
            create_at
          })
          .returning("id")
          .then(id => {
            if (id.length === 0) return false;
            else return true;
          });
      });
  });
};
