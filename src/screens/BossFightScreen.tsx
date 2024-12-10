import { StackNavigationProp } from '@react-navigation/stack';
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity, Dimensions, Button } from 'react-native';
import { RootStackParamList } from '../../app';

const { width, height } = Dimensions.get('window');

type Props = {
    navigation: StackNavigationProp<RootStackParamList, 'CirclesScreen'>;
};
const BossFightScreen: React.FC<Props> = ({ navigation }) => {
    const [heroHp, setHeroHp] = useState(100);
    const [bossHp, setBossHp] = useState(100);
    const [heroPosition, setHeroPosition] = useState({ x: 10, y: 50 });
    const [bossPosition] = useState(new Animated.ValueXY({ x: 50, y: 20 }));
    const [attackCooldown, setAttackCooldown] = useState(false);
    const [attackDots, setAttackDots] = useState<Animated.ValueXY[]>([]);
    const [bossAttackDots, setBossAttackDots] = useState<Animated.ValueXY[]>([]);
    const [gameOver, setGameOver] = useState(false);
    const [win, setWin] = useState(false);

    const moveHero = (direction: 'up' | 'down' | 'left' | 'right') => {
        if (gameOver) return;
        const moveDistance = 5;
        setHeroPosition((prevPos) => {
            const newPos = { ...prevPos };
            if (direction === 'up' && newPos.y > 0) newPos.y -= moveDistance;
            if (direction === 'down' && newPos.y < 90) newPos.y += moveDistance;
            if (direction === 'left' && newPos.x > 0) newPos.x -= moveDistance;
            if (direction === 'right' && newPos.x < 90) newPos.x += moveDistance;
            return newPos;
        });
    };

    const bossMove = () => {
        const x = Math.random() * 80 + 10;
        const y = Math.random() * 40 + 10;
        Animated.timing(bossPosition, {
            toValue: { x, y },
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    const heroAttack = () => {
        if (attackCooldown || bossHp <= 0 || heroHp <= 0) return;
        setAttackCooldown(true);
        const dots = [];
        for (let i = 0; i < 5; i++) {
            const dot = new Animated.ValueXY({ x: heroPosition.x * width / 100, y: heroPosition.y * height / 100 });
            dots.push(dot);
            Animated.timing(dot, {
                toValue: {
                    x: bossPosition.x._value * width / 100 + Math.random() * 10,
                    y: bossPosition.y._value * height / 100 + Math.random() * 10,
                },
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
        setAttackDots(dots);
        setTimeout(() => setAttackCooldown(false), 2000);
    };

    const bossAttack = () => {
        if (Math.random() < 0.5) {
            const dots = [];
            for (let i = 0; i < 3; i++) {
                const dot = new Animated.ValueXY({ x: bossPosition.x._value * width / 100, y: bossPosition.y._value * height / 100 });
                dots.push(dot);
                Animated.timing(dot, {
                    toValue: { x: heroPosition.x * width / 100 + Math.random() * 10, y: heroPosition.y * height / 100 + Math.random() * 10 },
                    duration: 1000,
                    useNativeDriver: true,
                }).start();
            }
            setBossAttackDots(dots);
            setHeroHp((prevHp) => prevHp - 10);
        }
    };

    const checkImpact = () => {
        attackDots.forEach((dot) => {
            const dotX = dot.x._value;
            const dotY = dot.y._value;
            const bossX = bossPosition.x._value * width / 100;
            const bossY = bossPosition.y._value * height / 100;

            if (Math.abs(dotX - bossX) < 30 && Math.abs(dotY - bossY) < 30) {
                setBossHp((prevHp) => prevHp - 10);
            }
        });

        bossAttackDots.forEach((dot) => {
            const dotX = dot.x._value;
            const dotY = dot.y._value;
            if (Math.abs(dotX - heroPosition.x * width / 100) < 30 && Math.abs(dotY - heroPosition.y * height / 100) < 30) {
                setHeroHp((prevHp) => prevHp - 10);
            }
        });
    };

    const checkGameOver = () => {
        if (heroHp <= 0) {
            setGameOver(true);
        }
        if (bossHp <= 0) {
            setWin(true);
            setTimeout(() => setGameOver(true), 1000);
        }
    };

    useEffect(() => {
        const interval = setInterval(() => {
            if (!gameOver) {
                bossAttack();
            }
        }, 3000);

        const moveInterval = setInterval(() => {
            if (!gameOver) bossMove();
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(moveInterval);
        };
    }, [gameOver, heroHp, bossHp]);

    useEffect(() => {
        checkImpact();
        checkGameOver();
    }, [attackDots, bossAttackDots]);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.heroHpText}>Hero HP: {heroHp}</Text>
                <Text style={styles.bossHpText}>Boss HP: {bossHp}</Text>
            </View>

            <View style={styles.gameArea}>
                <Animated.View
                    style={[styles.boss, { transform: [{ translateX: bossPosition.x }, { translateY: bossPosition.y }] }]}
                >
                    <Image source={require('../../assets/images/zombie-cat.png')} style={styles.bossImage} />
                </Animated.View>

                {attackDots.map((dot, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.attackDot, { left: dot.x, top: dot.y }]}
                    />
                ))}
                {bossAttackDots.map((dot, index) => (
                    <Animated.View
                        key={index}
                        style={[styles.attackDot, { left: dot.x, top: dot.y }]}
                    />
                ))}

                <TouchableOpacity
                    onPress={heroAttack}
                    style={[styles.hero, { left: heroPosition.x * width / 100, top: heroPosition.y * height / 100 }]}
                >
                    <Image source={require('../../assets/images/incorrect4.png')} style={styles.heroImage} />
                </TouchableOpacity>
            </View>

            <View style={styles.controls}>
                <Button title="↑" onPress={() => moveHero('up')} />
                <Button title="↓" onPress={() => moveHero('down')} />
                <Button title="←" onPress={() => moveHero('left')} />
                <Button title="→" onPress={() => moveHero('right')} />
            </View>

            {gameOver && (
                <View style={styles.gameOverContainer}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                    {win && <Text style={styles.winText}>You Win!</Text>}
                    <Button title="Exit" onPress={() => navigation.navigate("WorkInProgress")} />
                </View>
            )}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#000',
        justifyContent: 'center',
        alignItems: 'center',
    },
    topBar: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
        padding: 10,
    },
    heroHpText: {
        color: 'green',
        fontSize: 20,
    },
    bossHpText: {
        color: 'red',
        fontSize: 20,
    },
    gameArea: {
        flex: 1,
        width: '90%',
        height: '60%',
        position: 'relative',
    },
    boss: {
        position: 'absolute',
        width: 100,
        height: 100,
    },
    bossImage: {
        width: 100,
        height: 100,
    },
    attackDot: {
        position: 'absolute',
        width: 10,
        height: 10,
        borderRadius: 5,
        backgroundColor: 'white',
    },
    hero: {
        position: 'absolute',
        width: 100,
        height: 100,
        justifyContent: 'center',
        alignItems: 'center',
    },
    heroImage: {
        width: 100,
        height: 100,
    },
    controls: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '40%',
        bottom: 20,
    },
    gameOverContainer: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
        justifyContent: 'center',
        alignItems: 'center',
    },
    gameOverText: {
        color: 'white',
        fontSize: 30,
    },
    winText: {
        color: 'yellow',
        fontSize: 30,
    },
});

export default BossFightScreen;
