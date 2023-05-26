pragma solidity 0.8.18;

contract Counter {
    uint256 private _count;

    event CounterIncreased();
    event CounterDecreased();

    function inclement() external {
        unchecked {
            _count++;
        }

        emit CounterIncreased();
    }

    function declement() external {
        _count--;

        emit CounterDecreased();
    }

    function getCounterValue() external view returns (uint256) {
        return _count;
    }
}