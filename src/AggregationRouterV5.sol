pragma solidity 0.8.17;

import "./EIP712.sol";
import "./helpers/ECDSA.sol";
import "./Ownable.sol";
import "./helpers/Context.sol";
import "./routers/ClipperRouter.sol";
import "./routers/GenericRouter.sol";
import "./routers/UnoswapRouter.sol";
import "./routers/UnoswapV3Router.sol";
import "./OrderMixin.sol";
import "./OrderRFQMixin.sol";

/// @notice Main contract incorporates a number of routers to perform swaps and limit orders protocol to fill limit orders
contract AggregationRouterV5 is EIP712("1inch Aggregation Router", "5"), Ownable,
    ClipperRouter, GenericRouter, UnoswapRouter, UnoswapV3Router, OrderMixin, OrderRFQMixin
{
    using UniERC20 for IERC20;

    error ZeroAddress();

    /**
     * @dev Sets the wrapped eth token and clipper exhange interface
     * Both values are immutable: they can only be set once during
     * construction.
     */
    constructor(IWETH weth)
        UnoswapV3Router(weth)
        ClipperRouter(weth)
        OrderMixin(weth)
        OrderRFQMixin(weth)
    {
        if (address(weth) == address(0)) revert ZeroAddress();
    }

    /**
     * @notice Retrieves funds accidently sent directly to the contract address
     * @param token ERC20 token to retrieve
     * @param amount amount to retrieve
     */
    function rescueFunds(IERC20 token, uint256 amount) external onlyOwner {
        token.uniTransfer(payable(msg.sender), amount);
    }

    /**
     * @notice Destroys the contract and sends eth to sender. Use with caution.
     * The only case when the use of the method is justified is if there is an exploit found.
     * And the damage from the exploit is greater than from just an urgent contract change.
     */
    function destroy() external onlyOwner {
        selfdestruct(payable(msg.sender));
    }

    function _receive() internal override(EthReceiver, OnlyWethReceiver) {
        EthReceiver._receive();
    }
}