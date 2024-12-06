import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, Animated, TouchableOpacity } from 'react-native';

type WeaponType = 'sword' | 'bow' | 'magic';

const BossFightScreen: React.FC = () => {
    const [heroHp, setHeroHp] = useState<number>(100);
    const [bossHp, setBossHp] = useState<{ sword: number; bow: number; magic: number }>({
        sword: 100,
        bow: 100,
        magic: 100,
    });

    const [currentWeapon, setCurrentWeapon] = useState<WeaponType | null>(null);
    const [bossPosition, setBossPosition] = useState<Animated.ValueXY>(new Animated.ValueXY({ x: 100, y: 100 }));
    const [bossAttacking, setBossAttacking] = useState<boolean>(false);

    const bossMove = () => {
        Animated.timing(bossPosition, {
            toValue: {
                x: Math.random() * 300,
                y: Math.random() * 500,
            },
            duration: 2000,
            useNativeDriver: true,
        }).start();
    };

    const heroAttack = (weapon: WeaponType) => {
        if (weapon && bossHp[weapon] > 0) {
            const damage = 20; // Arbitrary damage for each attack
            const newBossHp = { ...bossHp };
            newBossHp[weapon] -= damage;
            setBossHp(newBossHp);
            setCurrentWeapon(weapon);

            // Start attack animation
            Animated.timing(bossPosition, {
                toValue: { x: bossPosition.x._value + 50, y: bossPosition.y._value + 50 },
                duration: 500,
                useNativeDriver: true,
            }).start();
        }
    };

    const bossAttack = () => {
        if (Math.random() < 0.5) {
            // 50% chance for boss to attack hero
            setHeroHp(heroHp - 10); // Arbitrary damage to hero
        }
    };

    const checkGameOver = () => {
        if (heroHp <= 0) {
            alert('Game Over');
            resetGame();
        }
        if (Object.values(bossHp).every((hp) => hp <= 0)) {
            alert('You Win!');
            resetGame();
        }
    };

    const resetGame = () => {
        setHeroHp(100);
        setBossHp({ sword: 100, bow: 100, magic: 100 });
        setBossPosition(new Animated.ValueXY({ x: 100, y: 100 }));
    };

    useEffect(() => {
        // Boss attacks every 3 seconds
        const interval = setInterval(() => {
            if (!bossAttacking) {
                setBossAttacking(true);
                bossAttack();
                setBossAttacking(false);
            }
        }, 3000);

        // Boss keeps moving randomly
        const moveInterval = setInterval(() => {
            bossMove();
        }, 2000);

        return () => {
            clearInterval(interval);
            clearInterval(moveInterval);
        };
    }, [heroHp, bossHp]);

    return (
        <View style={styles.container}>
            <View style={styles.topBar}>
                <Text style={styles.heroHpText}>Hero HP: {heroHp}</Text>
                <Text style={styles.bossHpText}>Boss HP: Sword: {bossHp.sword} Bow: {bossHp.bow} Magic: {bossHp.magic}</Text>
            </View>

            <View style={styles.gameArea}>
                {/* Boss Image */}
                <Animated.View
                    style={[styles.boss, { transform: [{ translateX: bossPosition.x }, { translateY: bossPosition.y }] }]}
                >
                    <Image source={require('../../assets/images/zombie-cat.png')} style={styles.bossImage} />
                </Animated.View>

                {/* Weapon Selection */}
                <View style={styles.weaponSelection}>
                    <TouchableOpacity onPress={() => heroAttack('sword')} style={styles.weaponButton}>
                        <Text style={styles.weaponText}>Sword</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => heroAttack('bow')} style={styles.weaponButton}>
                        <Text style={styles.weaponText}>Bow</Text>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => heroAttack('magic')} style={styles.weaponButton}>
                        <Text style={styles.weaponText}>Magic</Text>
                    </TouchableOpacity>
                </View>

                {/* Hero Attack */}
                <View style={styles.hero}>
                    <Text style={styles.heroText}>Hero</Text>
                </View>
            </View>

            {heroHp <= 0 && (
                <View style={styles.gameOverScreen}>
                    <Text style={styles.gameOverText}>Game Over</Text>
                </View>
            )}
            {Object.values(bossHp).every((hp) => hp <= 0) && (
                <View style={styles.winScreen}>
                    <Text style={styles.winText}>You Win!</Text>
                </View>
            )}
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
    topBar: {
        position: 'absolute',
        top: 10,
        left: 10,
        right: 10,
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '90%',
        padding: 10,
    },
    heroHpText: {
        color: 'white',
        fontSize: 20,
    },
    bossHpText: {
        color: 'white',
        fontSize: 20,
    },
    gameArea: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
    },
    boss: {
        position: 'absolute',
        width: 100,
        height: 100,
    },
    bossImage: {
        width: '100%',
        height: '100%',
    },
    weaponSelection: {
        position: 'absolute',
        bottom: 20,
        flexDirection: 'row',
        justifyContent: 'space-around',
        width: '100%',
    },
    weaponButton: {
        backgroundColor: 'blue',
        padding: 10,
        margin: 10,
        borderRadius: 5,
    },
    weaponText: {
        color: 'white',
        fontSize: 16,
    },
    hero: {
        position: 'absolute',
        bottom: 100,
        width: 100,
        height: 100,
        backgroundColor: 'red',
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: 50,
    },
    heroText: {
        color: 'white',
        fontSize: 16,
    },
    gameOverScreen: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 10,
    },
    gameOverText: {
        color: 'white',
        fontSize: 30,
    },
    winScreen: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: [{ translateX: -100 }, { translateY: -50 }],
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        padding: 20,
        borderRadius: 10,
    },
    winText: {
        color: 'white',
        fontSize: 30,
    },
});

export default BossFightScreen;
