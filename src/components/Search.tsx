import React from 'react';
import styled from 'styled-components';

const InputContainer = styled.div`
    position: relative;
    display: flex;
    flex-direction: row;
    margin-right: 20px;
`;

const SearchInput = styled.input`
    padding: 10px 45px 10px 15px;
    width: 400px;
    font-size: 16px;
    border-radius: 4px;
    border: none;

    @media (max-width: 768px) {
        width: 300px;
    }
    
    @media (max-width: 440px) {
        width: 180px;
    }
`;

const Clear = styled.div`
    position: absolute;
    right: 15px;
    top: 10px;
    width: 20px;
    height: 20px;
    cursor: pointer;
    
    &::before,
    &::after {
        content: "";
        position: absolute;
        left: 50%;
        top: 50%;
        width: 2px;
        height: 30px;
        background-color: #000000;
        transform-origin: center;
    }

    &::before {
        transform: translate(-50%, -50%) rotate(45deg);
    }

    &::after {
        transform: translate(-50%, -50%) rotate(-45deg);
    }
`;

type SearchProps = {
    query: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onClear: () => void;
}

const Search = ({ query, onChange, onClear }: SearchProps) => (
    <InputContainer>
        <SearchInput
            type="text"
            placeholder="Search Movies..."
            value={query}
            onChange={onChange}
        />
        {!!query && <Clear onClick={onClear}/>}
    </InputContainer>
);

export default Search;
