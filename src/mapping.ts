import { Transfer as TransferEvent, StarNFTV4 as TokenContract, } from "../generated/StarNFTV4/StarNFTV4";
import { Token, User } from "../generated/schema";


export function handleTransfer(event: TransferEvent): void {

    let token = Token.load(event.params.tokenId.toString());
  if (!token) {
    token = new Token(event.params.tokenId.toString());
    token.creator = event.params.to.toHexString();
    token.tokenID = event.params.tokenId;
  
    let tokenContract = TokenContract.bind(event.address);
    token.contentURI = tokenContract.tokenURI(event.params.tokenId);
    // token.tokenIPFSPath = tokenContract.getTokenIPFSPath(event.params.tokenId);
    token.name = tokenContract.name();
    token.createdAtTimestamp = event.block.timestamp;
  }
//   SET NEW OWNER
  token.owner = event.params.to.toHexString();
  token.save();
    
  let user = User.load(event.params.to.toHexString());
  if (!user) {
    user = new User(event.params.to.toHexString());
    user.save();
  }
}
// export function handleTokenURIUpdated(event: TokenIPFSPathUpdatedEvent): void {
//     let token = Token.load(event.params.tokenId.toString());
//     if (!token) return
//     token.tokenIPFSPath = event.params.tokenIPFSPath;
//     token.save();
//   }