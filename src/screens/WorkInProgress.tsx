// import React from 'react';
// import { View, Text, StyleSheet } from 'react-native';

// const WorkInProgress: React.FC = () => {
//     return (
//         <View style={styles.container}>
//             <Text style={styles.text}>Work in Progress 🚧</Text>
//         </View>
//     );
// };

// const styles = StyleSheet.create({
//     container: {
//         flex: 1,
//         justifyContent: 'center',
//         alignItems: 'center',
//         backgroundColor: '#000',
//     },
//     text: {
//         color: '#FFF',
//         fontSize: 24,
//         fontWeight: 'bold',
//     },
// });

// export default WorkInProgress;
import React, { useEffect, useState } from 'react';
import { Text, View, Animated, StyleSheet } from 'react-native';

const WorkInProgress = () => {
    const [textIndex, setTextIndex] = useState(0);
    const rollAnimation = new Animated.Value(100);

    const credits = [
        'Writer: Koryun',
        'Produced by: Koryun',
        'Developer: Koryun',
        'Actor: Koryun',
        'Created by: Koryun',
        'And special thanks to...',
        'Additional actors: Raya and Toffi',
        'The End'
    ];

    useEffect(() => {
        const loopCredits = () => {
            setTextIndex(0); // Reset to beginning of credits
            Animated.timing(rollAnimation, {
                toValue: -2000, // Adjust to make it go off-screen
                duration: 50000, // Adjust speed of scroll
                useNativeDriver: true,
            }).start();
        };
        loopCredits();
    }, []);

    return (
        <View style={styles.container}>
            <Animated.View style={[styles.creditsContainer, { transform: [{ translateY: rollAnimation }] }]}>
                {credits.map((credit, index) => (
                    <Text key={index} style={styles.creditText}>
                        {credit}
                    </Text>
                ))}
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'black',
    },
    creditsContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
    },
    creditText: {
        fontSize: 24,
        color: 'white',
        textAlign: 'center',
        marginBottom: 20,
        fontWeight: 'bold',
    },
});

export default WorkInProgress;
