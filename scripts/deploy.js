async function main() {
  const [deployer] = await ethers.getSigners();

  console.log("Deploying contracts with the account:", deployer.address);

  const Ecommerce = await ethers.getContractFactory("Ecommerce");
  const ecommerce = await Ecommerce.deploy();

  console.log("Ecommerce contract deployed to:", ecommerce.address);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
