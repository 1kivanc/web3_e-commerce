const { expect } = require("chai");
const { ethers } = require("hardhat");

describe("Ecommerce", function () {
  let Ecommerce;
  let ecommerce;
  let owner;
  let addr1;
  let addr2;

  beforeEach(async function () {
    Ecommerce = await ethers.getContractFactory("Ecommerce");
    [owner, addr1, addr2] = await ethers.getSigners();
    ecommerce = await Ecommerce.deploy();
    await ecommerce.deployed();
  });

  it("should create a new product", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    const product = await ecommerce.products(1);

    expect(product.name).to.equal(name);
    expect(product.price).to.equal(price);
    expect(product.imageUrl).to.equal(imageUrl);
    expect(product.owner).to.equal(owner.address);
    expect(product.purchased).to.be.false;
  });

  it("should allow a product to be purchased", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await ecommerce.connect(addr1).purchaseProduct(1, { value: price });

    const product = await ecommerce.products(1);

    expect(product.purchased).to.be.true;
    expect(product.owner).to.equal(addr1.address);
  });

  it("should revert if not enough Ether is sent for purchase", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await expect(
      ecommerce
        .connect(addr1)
        .purchaseProduct(1, { value: ethers.utils.parseEther("0.5") })
    ).to.be.revertedWith("Insufficient Ether sent");
  });

  it("should not allow the owner to purchase their own product", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await expect(
      ecommerce.purchaseProduct(1, { value: price })
    ).to.be.revertedWith("Cannot buy your own product");
  });

  it("should allow the owner to delete their product", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await ecommerce.deleteProduct(1);

    const product = await ecommerce.products(1);
    expect(product.exists).to.be.false;
  });

  it("should not allow non-owners to delete the product", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await expect(ecommerce.connect(addr1).deleteProduct(1)).to.be.revertedWith(
      "Only the owner can delete the product"
    );
  });

  it("should allow the owner to resell a purchased product", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await ecommerce.connect(addr1).purchaseProduct(1, { value: price });

    const newPrice = ethers.utils.parseEther("2");
    await ecommerce.connect(addr1).resellProduct(1, newPrice);

    const product = await ecommerce.products(1);

    expect(product.price).to.equal(newPrice);
    expect(product.purchased).to.be.false;
  });

  it("should not allow non-owners to resell a product", async function () {
    const name = "Test Product";
    const price = ethers.utils.parseEther("1");
    const imageUrl = "https://example.com/image.jpg";
    await ecommerce.createProduct(name, price, imageUrl);

    await ecommerce.connect(addr1).purchaseProduct(1, { value: price });

    const newPrice = ethers.utils.parseEther("2");
    await expect(
      ecommerce.connect(addr2).resellProduct(1, newPrice)
    ).to.be.revertedWith("You do not own this product");
  });
});
