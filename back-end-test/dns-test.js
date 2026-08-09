const dns = require("dns").promises;

(async () => {
  try {
    const records = await dns.resolveSrv(
      "_mongodb._tcp.cluster0.bg4nn20.mongodb.net"
    );
    console.log(records);
  } catch (err) {
    console.error(err);
  }
})();