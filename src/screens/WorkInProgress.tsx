import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const WorkInProgress: React.FC = () => {
    return (
        <View style={styles.container}>
            <Text style={styles.text}>Work in Progress 🚧</Text>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#000',
    },
    text: {
        color: '#FFF',
        fontSize: 24,
        fontWeight: 'bold',
    },
});

export default WorkInProgress;
