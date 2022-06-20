// Next.js API route support: https://nextjs.org/docs/api-routes/introduction

export default async function handler(req, res) {
  const champData = await axios.get(
    "http://ddragon.leagueoflegends.com/cdn/12.11.1/data/en_US/champion.json"
  );
  console.log(Object.values(champData.data.data)[0]);
  res.status(200).json({ name: "John Doe" });
}
