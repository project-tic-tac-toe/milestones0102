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
module.exports.getPrizeOfProduct = async (id)=> {
  return await knex("products")
    .where({ id: id })
    .select("*")
    .then(items => {
      if (items.length !== 0) return items[0].prize;
      else return 0;
    });
};

//Tim invoices
module.exports.getInvoicesDetailProduct = async (id)=> {
  return await knex("invoices_detail_product")
    .where({ id: id })
    .select("*")
    .then(items => {
      if (items.length !== 0) return items[0];
      else return null;
    });
};

module.exports.updatePrizeTotalForInvoice = (arrInvoiceChange)=> {
  arrInvoiceChange.forEach(id => {
    let total = 0;
    let create_at = new Date();
    console.log(id);
    knex("invoices_detail_product")
      .where({ id_invoice: id })
      .select("total_product")
      .then(items => {
        if (items.length !== 0) {
          console.log(items);
          items.forEach(t => {
            total = total + parseInt(t.total_product);
          });
        }
      })
      .then(() => {
        console.log(total);
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
