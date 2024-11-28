// components/Header.tsx
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

type HeaderProps = {
    unlockedIndexes: number[]; // Indices of squares to unlock
};

const Header: React.FC<HeaderProps> = ({ unlockedIndexes }) => {
    const squares = Array(5).fill(null);

    return (
        <View style={styles.header}>
            {squares.map((_, index) => (
                <View
                    key={index}
                    style={[
                        styles.square,
                        unlockedIndexes.includes(index) && styles.unlockedSquare,
                    ]}
                >
                    {unlockedIndexes.includes(index) && (
                        <Text style={styles.symbol}>★</Text> // Replace ★ with any symbol
                    )}
                </View>
            ))}
        </View>
    );
};

export default Header;

const styles = StyleSheet.create({
    header: {
        flexDirection: 'row',
        justifyContent: 'center', // Center squares
        alignItems: 'center',
        padding: 10,
        backgroundColor: 'black', // Customize background color if needed
    },
    square: {
        width: 40, // Adjust size for closer spacing
        height: 40,
        marginHorizontal: 5, // Add spacing between squares
        borderWidth: 2,
        borderColor: 'white',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'transparent',
    },
    unlockedSquare: {
        backgroundColor: 'white', // Background color when unlocked
    },
    symbol: {
        fontSize: 20,
        color: 'black', // Symbol color
    },
});
