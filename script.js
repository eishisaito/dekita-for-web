// デフォルトのメダルデータ
const defaultMedals = [
    { id: 1, name: 'ごはん', icon: '🍽️', goal: 1, current: 0, dates: [] },
    { id: 2, name: 'はみがき', icon: '🦷', goal: 1, current: 0, dates: [] },
    { id: 3, name: 'おかたづけ', icon: '🧹', goal: 1, current: 0, dates: [] },
    { id: 4, name: 'トイレ', icon: '🚽', goal: 1, current: 0, dates: [] },
    { id: 5, name: 'あいさつ', icon: '👋', goal: 1, current: 0, dates: [] },
    { id: 6, name: 'おきがえ', icon: '👕', goal: 1, current: 0, dates: [] }
];

let medals = [];
let nextId = 7;
let currentMedalId = 1;

// 初期化
function init() {
    const savedMedals = JSON.parse(localStorage.getItem('medals') || 'null');
    const savedNextId = localStorage.getItem('nextId');
    
    if (savedMedals && savedMedals.length > 0) {
        medals = savedMedals.map(medal => ({
            ...medal,
            dates: medal.dates || []
        }));
        nextId = savedNextId ? parseInt(savedNextId) : Math.max(...medals.map(m => m.id)) + 1;
    } else {
        medals = [...defaultMedals];
    }
    
    renderMedalsList();
}

// メダル一覧の表示
function renderMedalsList() {
    const list = document.getElementById('medalsList');
    list.innerHTML = '';

    medals.forEach(medal => {
        const categoryDiv = document.createElement('div');
        categoryDiv.className = 'medal-category';

        const itemDiv = document.createElement('div');
        itemDiv.className = 'medal-item';
        itemDiv.onclick = () => showMedalCollectionModal(medal);

        const headerDiv = document.createElement('div');
        headerDiv.className = 'medal-header';

        const iconDiv = document.createElement('div');
        iconDiv.className = 'medal-icon';
        iconDiv.textContent = medal.icon;

        const infoDiv = document.createElement('div');
        infoDiv.className = 'medal-info';

        const titleDiv = document.createElement('div');
        titleDiv.className = 'medal-title';
        titleDiv.textContent = medal.name;

        const goalDiv = document.createElement('div');
        goalDiv.className = 'medal-goal';
        const remaining = Math.max(0, medal.goal - medal.current);
        if (remaining > 0) {
            goalDiv.innerHTML = `
                <div style="color: var(--text-gray); font-size: 0.9em;">
                    やったかず: <span style="font-weight: bold; color: var(--primary-orange);">${medal.current}</span> かい
                </div>
                <div style="color: var(--text-gray); font-size: 0.9em; margin-top: 2px;">
                    ゴールまで あと <span style="font-weight: bold; color: var(--primary-orange);">${remaining}</span> こ！
                </div>
            `;
        } else {
            goalDiv.innerHTML = `
                <div style="color: var(--primary-yellow); font-weight: bold; font-size: 0.95em;">
                    🎉 ゴールたっせい！ ${medal.current} かい やったよ！
                </div>
            `;
        }

        const progressDiv = document.createElement('div');
        progressDiv.className = 'medal-progress-mini';

        // 目標が多い場合は点の表示を調整
        if (medal.goal <= 10) {
            // 10個以下の場合は全て点で表示
            for (let i = 0; i < medal.goal; i++) {
                const dot = document.createElement('div');
                dot.className = `progress-dot ${i < medal.current ? 'earned' : 'empty'}`;
                dot.textContent = i < medal.current ? '●' : '○';
                progressDiv.appendChild(dot);
            }
        } else {
            // 10個を超える場合はプログレスバー表示
            const progressBar = document.createElement('div');
            progressBar.style.cssText = `
                width: 100%;
                height: 8px;
                background: #E0E0E0;
                border-radius: 4px;
                overflow: hidden;
                margin-top: 8px;
            `;
            
            const progressFill = document.createElement('div');
            const percentage = (medal.current / medal.goal) * 100;
            progressFill.style.cssText = `
                width: ${percentage}%;
                height: 100%;
                background: linear-gradient(90deg, var(--primary-orange), var(--primary-yellow));
                border-radius: 4px;
                transition: width 0.3s ease;
            `;
            
            progressBar.appendChild(progressFill);
            progressDiv.appendChild(progressBar);
            
            // パーセンテージ表示
            const percentText = document.createElement('div');
            percentText.style.cssText = `
                font-size: 0.8em;
                color: var(--text-gray);
                text-align: center;
                margin-top: 4px;
            `;
            percentText.textContent = `${Math.round(percentage)}%`;
            progressDiv.appendChild(percentText);
        }

        // できた！ボタンを追加
        const doneButton = document.createElement('button');
        doneButton.style.cssText = `
            margin-top: 12px;
            padding: 12px 20px;
            background: var(--primary-orange);
            color: white;
            border: none;
            border-radius: 20px;
            font-size: 1em;
            font-weight: bold;
            text-align: center;
            cursor: pointer;
            transition: all 0.3s ease;
            width: 100%;
        `;
        doneButton.textContent = 'できた！';
        doneButton.addEventListener('click', (e) => {
            e.preventDefault();
            e.stopPropagation(); // 親要素のクリックイベントを止める
            console.log('できた！ボタンが押されました:', medal.name); // デバッグ用
            
            // ボタンを一時的に無効化（連打防止）
            doneButton.disabled = true;
            doneButton.style.opacity = '0.6';
            doneButton.textContent = 'しょりちゅう...';
            
            // メダル処理実行
            incrementMedal(medal.id);
            
            // 2秒後にボタンを再有効化
            setTimeout(() => {
                doneButton.disabled = false;
                doneButton.style.opacity = '1';
                doneButton.textContent = 'できた！';
            }, 2000);
        });

        infoDiv.appendChild(titleDiv);
        infoDiv.appendChild(goalDiv);
        headerDiv.appendChild(iconDiv);
        headerDiv.appendChild(infoDiv);
        itemDiv.appendChild(headerDiv);
        itemDiv.appendChild(progressDiv);
        itemDiv.appendChild(doneButton);
        categoryDiv.appendChild(itemDiv);
        list.appendChild(categoryDiv);
    });
}

// メダルをインクリメント
function incrementMedal(medalId) {
    console.log('incrementMedal called with ID:', medalId); // デバッグ用
    const medal = medals.find(m => m.id === medalId);
    console.log('Found medal:', medal); // デバッグ用
    
    if (!medal) {
        console.error('Medal not found!');
        return;
    }
    
    if (medal.current >= medal.goal) {
        console.log('Medal already at goal, showing completion message');
        alert('もうゴールたっせい！すごいね！');
        return;
    }
    
    console.log('Incrementing medal:', medal.name); // デバッグ用
    medal.current++;
    
    // 取得日時を記録
    const now = new Date();
    medal.dates.push({
        date: now.toISOString(),
        displayDate: formatDate(now),
        displayTime: formatTime(now)
    });
    
    saveMedals();
    renderMedalsList();
    
    // 必ずメダルゲット演出を表示
    setTimeout(() => {
        showMedalGetAnimation(medal);
    }, 100); // 少し遅延させて確実に表示
    
    // 完了チェック（ゴール達成時の特別演出）
    if (medal.current >= medal.goal) {
        setTimeout(() => {
            createConfetti();
            showCompletionModal(medal);
        }, 2000); // メダルゲット演出の後に表示
    }
}

// メダルゲット演出
function showMedalGetAnimation(medal) {
    console.log('showMedalGetAnimation called for:', medal.name); // デバッグ用
    
    // 軽い紙吹雪
    createLightConfetti();
    
    // 既存のポップアップがあれば削除
    const existingPopup = document.querySelector('.medal-get-popup');
    if (existingPopup) {
        existingPopup.remove();
    }
    
    // メダルゲットポップアップ
    const popup = document.createElement('div');
    popup.className = 'medal-get-popup';
    popup.style.cssText = `
        position: fixed;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        background: linear-gradient(135deg, var(--primary-yellow) 0%, #FFB347 100%);
        color: white;
        padding: 24px 32px;
        border-radius: 20px;
        font-size: 1.2em;
        font-weight: bold;
        z-index: 2500;
        box-shadow: 0 12px 40px rgba(0, 0, 0, 0.3);
        border: 3px solid white;
        pointer-events: none;
        opacity: 0;
        transform: translate(-50%, -50%) scale(0);
    `;
    popup.innerHTML = `
        <div style="text-align: center;">
            <div style="font-size: 2.5em; margin-bottom: 8px; filter: drop-shadow(2px 2px 4px rgba(0,0,0,0.3));">${medal.icon}</div>
            <div style="text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">メダルゲット！</div>
            <div style="font-size: 0.8em; margin-top: 4px; opacity: 0.9;">${medal.name}</div>
        </div>
    `;
    
    document.body.appendChild(popup);
    console.log('Popup added to DOM'); // デバッグ用
    
    // アニメーション実行
    requestAnimationFrame(() => {
        popup.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        popup.style.opacity = '1';
        popup.style.transform = 'translate(-50%, -50%) scale(1)';
        
        console.log('Animation started'); // デバッグ用
        
        // 1秒後にフェードアウト開始
        setTimeout(() => {
            popup.style.transition = 'all 0.4s ease';
            popup.style.opacity = '0';
            popup.style.transform = 'translate(-50%, -50%) scale(0.8)';
            
            // フェードアウト完了後に削除
            setTimeout(() => {
                if (popup.parentNode) {
                    popup.remove();
                    console.log('Popup removed'); // デバッグ用
                }
            }, 400);
        }, 1000);
    });
}

// 軽い紙吹雪エフェクト
function createLightConfetti() {
    for (let i = 0; i < 15; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = ['var(--primary-yellow)', 'var(--primary-orange)', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)];
        confetti.style.animationDelay = Math.random() * 1 + 's';
        confetti.style.animationDuration = '2s';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 2000);
    }
}

// 完了モーダル表示
function showCompletionModal(medal) {
    const subtitle = document.getElementById('completionSubtitle');
    subtitle.textContent = `${medal.name}メダルをゲット！`;
    showModalWithScrollLock('completionModal');
}

// ビュー切り替え
function switchView(view) {
    // ナビゲーションボタンの状態更新
    document.querySelectorAll('.nav-button').forEach(btn => {
        btn.classList.remove('active');
    });
    event.target.classList.add('active');

    switch(view) {
        case 'main':
            // メイン画面は常に表示されている
            break;
        case 'history':
            showHistoryModal();
            break;
        case 'settings':
            showSettingsModal();
            break;
    }
}

// 履歴モーダル表示
function showHistoryModal() {
    const content = document.getElementById('historyContent');
    content.innerHTML = '';

    medals.forEach(medal => {
        if (medal.dates && medal.dates.length > 0) {
            const sectionDiv = document.createElement('div');
            sectionDiv.innerHTML = `
                <h3 style="margin: 20px 0 12px 0; color: var(--text-dark);">
                    ${medal.icon} ${medal.name} (${medal.dates.length}個)
                </h3>
            `;

            const gridDiv = document.createElement('div');
            gridDiv.className = 'showcase-grid';

            medal.dates.forEach((dateInfo, index) => {
                const medalDiv = document.createElement('div');
                medalDiv.className = 'showcase-medal';
                medalDiv.textContent = medal.icon;
                medalDiv.onclick = () => showMedalDetail(medal, dateInfo, index + 1);

                const numberDiv = document.createElement('div');
                numberDiv.className = 'showcase-medal-number';
                numberDiv.textContent = index + 1;
                medalDiv.appendChild(numberDiv);

                gridDiv.appendChild(medalDiv);
            });

            sectionDiv.appendChild(gridDiv);
            content.appendChild(sectionDiv);
        }
    });

    if (content.children.length === 0) {
        content.innerHTML = '<div class="no-medals">まだメダルがありません</div>';
    }

    showModalWithScrollLock('historyModal');
}

// 設定モーダル表示
function showSettingsModal() {
    const list = document.getElementById('settingsMedalList');
    list.innerHTML = '';

    medals.forEach(medal => {
        const item = document.createElement('div');
        item.className = 'medal-list-item';
        item.style.display = 'block';
        item.style.padding = '16px';
        item.style.borderBottom = '1px solid var(--border-light)';
        
        const infoDiv = document.createElement('div');
        infoDiv.style.marginBottom = '12px';
        
        const titleSpan = document.createElement('div');
        titleSpan.textContent = `${medal.icon} ${medal.name}`;
        titleSpan.style.fontSize = '1.1em';
        titleSpan.style.fontWeight = 'bold';
        titleSpan.style.marginBottom = '8px';
        
        const progressSpan = document.createElement('div');
        progressSpan.textContent = `しんちょく: ${medal.current}/${medal.goal}`;
        progressSpan.style.color = 'var(--text-gray)';
        progressSpan.style.fontSize = '0.9em';
        
        // ゴール設定
        const goalDiv = document.createElement('div');
        goalDiv.style.marginTop = '8px';
        goalDiv.style.display = 'flex';
        goalDiv.style.alignItems = 'center';
        goalDiv.style.gap = '8px';
        
        const goalLabel = document.createElement('span');
        goalLabel.textContent = 'もくひょう:';
        goalLabel.style.fontSize = '0.9em';
        
        const goalInput = document.createElement('input');
        goalInput.type = 'number';
        goalInput.min = '1';
        goalInput.max = '100';
        goalInput.value = medal.goal;
        goalInput.style.width = '70px';
        goalInput.style.padding = '4px 8px';
        goalInput.style.border = '1px solid var(--border-light)';
        goalInput.style.borderRadius = '4px';
        goalInput.onchange = () => updateMedalGoal(medal.id, parseInt(goalInput.value));
        
        const goalUnit = document.createElement('span');
        goalUnit.textContent = 'こ';
        goalUnit.style.fontSize = '0.9em';
        
        goalDiv.appendChild(goalLabel);
        goalDiv.appendChild(goalInput);
        goalDiv.appendChild(goalUnit);
        
        // 削除ボタン
        const buttonDiv = document.createElement('div');
        buttonDiv.style.marginTop = '12px';
        
        const deleteBtn = document.createElement('button');
        deleteBtn.className = 'delete-btn';
        deleteBtn.textContent = 'さくじょ';
        deleteBtn.onclick = () => deleteMedal(medal.id);
        
        buttonDiv.appendChild(deleteBtn);
        
        infoDiv.appendChild(titleSpan);
        infoDiv.appendChild(progressSpan);
        infoDiv.appendChild(goalDiv);
        item.appendChild(infoDiv);
        item.appendChild(buttonDiv);
        list.appendChild(item);
    });

    showModalWithScrollLock('settingsModal');
}

// メダルのゴールを更新
function updateMedalGoal(medalId, newGoal) {
    if (newGoal < 1 || newGoal > 100) {
        alert('もくひょうは1から100のあいだで入れてね！');
        return;
    }
    
    const medal = medals.find(m => m.id === medalId);
    if (medal) {
        medal.goal = newGoal;
        // 現在の進捗がゴールを超えている場合は調整
        if (medal.current > medal.goal) {
            medal.current = medal.goal;
            // 余分な日付も削除
            medal.dates = medal.dates.slice(0, medal.goal);
        }
        saveMedals();
        renderMedalsList();
        showSettingsModal(); // 設定画面を再表示
    }
}

// メダル追加モーダル表示
function showAddMedalModal() {
    closeModal('settingsModal');
    showModalWithScrollLock('addMedalModal');
    document.getElementById('medalName').value = '';
    document.getElementById('medalIcon').value = '📚';
    document.getElementById('medalGoal').value = '1';
}

// 新しいメダル追加
function addNewMedal() {
    const name = document.getElementById('medalName').value.trim();
    const icon = document.getElementById('medalIcon').value;
    const goal = parseInt(document.getElementById('medalGoal').value);

    if (!name || goal < 1 || goal > 100) {
        alert('なまえともくひょう（1-100）を正しく入れてね！');
        return;
    }

    const newMedal = {
        id: nextId++,
        name: name,
        icon: icon,
        goal: goal,
        current: 0,
        dates: []
    };

    medals.push(newMedal);
    saveMedals();
    renderMedalsList();
    closeModal('addMedalModal');
}

// メダル削除
function deleteMedal(id) {
    if (confirm('このメダルをけしますか？')) {
        medals = medals.filter(m => m.id !== id);
        if (currentMedalId === id && medals.length > 0) {
            currentMedalId = medals[0].id;
            localStorage.setItem('currentMedalId', currentMedalId.toString());
        }
        saveMedals();
        renderMedalsList();
        showSettingsModal(); // 設定画面を再表示
    }
}

// 全リセット
function resetAllMedals() {
    if (confirm('すべてのメダルをリセットしますか？')) {
        medals.forEach(medal => {
            medal.current = 0;
            medal.dates = [];
        });
        saveMedals();
        renderMedalsList();
    }
}

// メダルコレクションモーダル表示
function showMedalCollectionModal(medal) {
    const header = document.getElementById('medalCollectionHeader');
    const content = document.getElementById('medalCollectionContent');

    // ヘッダー情報
    header.innerHTML = `
        <div style="font-size: 2.5em; margin-bottom: 12px;">${medal.icon}</div>
        <h2 style="color: var(--text-dark); margin-bottom: 8px;">${medal.name}</h2>
        <div style="color: var(--text-gray);">あつめたメダル: ${medal.dates ? medal.dates.length : 0} 個</div>
    `;

    // コンテンツ
    content.innerHTML = '';

    if (!medal.dates || medal.dates.length === 0) {
        content.innerHTML = '<div class="no-medals">まだメダルがありません<br>がんばってあつめよう！</div>';
    } else {
        const gridDiv = document.createElement('div');
        gridDiv.className = 'showcase-grid';

        // 獲得順に並べ替え（古い順）
        const sortedDates = [...medal.dates].sort((a, b) => new Date(a.date) - new Date(b.date));

        sortedDates.forEach((dateInfo, index) => {
            const medalDiv = document.createElement('div');
            medalDiv.className = 'showcase-medal';
            medalDiv.textContent = medal.icon;
            medalDiv.onclick = () => showMedalDetailModal(medal, dateInfo, index + 1);

            const numberDiv = document.createElement('div');
            numberDiv.className = 'showcase-medal-number';
            numberDiv.textContent = index + 1;
            medalDiv.appendChild(numberDiv);

            gridDiv.appendChild(medalDiv);
        });

        content.appendChild(gridDiv);
    }

    showModalWithScrollLock('medalCollectionModal');
}

// メダル詳細モーダル表示
function showMedalDetailModal(medal, dateInfo, number) {
    const detailHtml = `
        <div style="text-align: center; padding: 20px;">
            <div style="font-size: 4em; margin-bottom: 15px;">${medal.icon}</div>
            <h2 style="color: var(--primary-orange); margin-bottom: 10px;">${medal.name}</h2>
            <div style="background: var(--primary-yellow); color: white; padding: 10px 20px; border-radius: 20px; display: inline-block; margin-bottom: 20px; font-weight: bold;">
                🏆 ${number}こめのメダル
            </div>
            <div style="font-size: 1.2em; margin-bottom: 10px;">📅 ${dateInfo.displayDate}</div>
            <div style="font-size: 1.1em; color: var(--text-gray); margin-bottom: 20px;">🕒 ${dateInfo.displayTime}</div>
            
            <div style="background: var(--background-gray); border-radius: 15px; padding: 20px; margin: 20px 0;">
                <div style="margin-bottom: 15px; font-weight: bold; color: var(--text-dark);">ひづけをへんこう:</div>
                <div style="display: flex; gap: 10px; justify-content: center; align-items: center; flex-wrap: wrap;">
                    <input type="date" id="editDate" value="${new Date(dateInfo.date).toISOString().split('T')[0]}" 
                           style="padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 1em;">
                    <input type="time" id="editTime" value="${new Date(dateInfo.date).toTimeString().split(' ')[0].substring(0,5)}" 
                           style="padding: 8px 12px; border: 1px solid var(--border-light); border-radius: 8px; font-size: 1em;">
                    <button onclick="updateMedalDate('${dateInfo.date}', '${medal.name}')" 
                            style="background: var(--primary-orange); color: white; 
                                   border: none; padding: 10px 15px; border-radius: 8px; cursor: pointer; 
                                   font-weight: bold;">
                        💾 ほぞん
                    </button>
                </div>
            </div>
            
            <div style="margin-top: 20px; color: var(--primary-orange); font-weight: bold;">
                ✨ よくがんばりました！ ✨
            </div>
        </div>
    `;
    
    // 詳細モーダル表示
    const tempModal = document.createElement('div');
    tempModal.style.cssText = `
        position: fixed; top: 0; left: 0; width: 100%; height: 100%; 
        background: rgba(0,0,0,0.6); z-index: 2000; display: flex; 
        align-items: center; justify-content: center; backdrop-filter: blur(5px);
        overflow-y: auto;
    `;
    
    const tempContent = document.createElement('div');
    tempContent.style.cssText = `
        background: white; border-radius: 16px; max-width: 400px; width: 90%;
        box-shadow: 0 8px 32px rgba(0,0,0,0.2); max-height: 90vh; overflow-y: auto; margin: 20px;
    `;
    tempContent.innerHTML = detailHtml + `
        <div style="text-align: center; padding: 0 20px 20px; display: flex; gap: 10px; justify-content: center;">
            <button onclick="deleteMedalDate('${dateInfo.date}', '${medal.name}')" 
                    style="background: #FF4757; color: white; 
                           border: none; padding: 12px 20px; border-radius: 16px; cursor: pointer; 
                           font-weight: bold;">
                🗑️ さくじょ
            </button>
            <button onclick="closeTempModal()" 
                    style="background: var(--text-gray); color: white; 
                           border: none; padding: 12px 24px; border-radius: 16px; cursor: pointer; 
                           font-weight: bold;">
                とじる
            </button>
        </div>
    `;
    
    tempModal.className = 'temp-modal';
    tempModal.appendChild(tempContent);
    document.body.appendChild(tempModal);
    
    // 背景スクロールを無効化
    document.body.style.overflow = 'hidden';
    
    // 背景クリックで閉じる
    tempModal.onclick = (e) => {
        if (e.target === tempModal) {
            closeTempModal();
        }
    };
}

// メダルの日付を更新
function updateMedalDate(originalDateString, medalName) {
    const newDate = document.getElementById('editDate').value;
    const newTime = document.getElementById('editTime').value;
    
    if (!newDate || !newTime) {
        alert('ひづけとじかんを入れてね！');
        return;
    }
    
    const newDateTime = new Date(`${newDate}T${newTime}`);
    
    // 該当するメダルを見つけて日付を更新
    medals.forEach(medal => {
        if (medal.name === medalName && medal.dates) {
            const dateIndex = medal.dates.findIndex(d => d.date === originalDateString);
            if (dateIndex !== -1) {
                medal.dates[dateIndex] = {
                    date: newDateTime.toISOString(),
                    displayDate: formatDate(newDateTime),
                    displayTime: formatTime(newDateTime)
                };
            }
        }
    });
    
    saveMedals();
    
    // モーダルを閉じて再表示
    closeTempModal();
    
    // メダルコレクション画面を更新
    const updatedMedal = medals.find(m => m.name === medalName);
    if (updatedMedal) {
        showMedalCollectionModal(updatedMedal);
    }
    
    // メイン画面も更新
    renderMedalsList();
}

// メダルの日付を削除
function deleteMedalDate(dateString, medalName) {
    if (!confirm('このメダルをけしますか？')) {
        return;
    }
    
    // 該当するメダルを見つけて日付を削除
    medals.forEach(medal => {
        if (medal.name === medalName && medal.dates) {
            const dateIndex = medal.dates.findIndex(d => d.date === dateString);
            if (dateIndex !== -1) {
                medal.dates.splice(dateIndex, 1);
                medal.current = Math.max(0, medal.current - 1);
            }
        }
    });
    
    saveMedals();
    
    // モーダルを閉じて再表示
    closeTempModal();
    
    // メダルコレクション画面を更新
    const updatedMedal = medals.find(m => m.name === medalName);
    if (updatedMedal) {
        showMedalCollectionModal(updatedMedal);
    }
    
    // メイン画面も更新
    renderMedalsList();
}

// 一時モーダルを閉じる
function closeTempModal() {
    const tempModal = document.querySelector('.temp-modal');
    if (tempModal) {
        tempModal.remove();
        // 背景スクロールを再有効化（メインモーダルがまだ開いているので hidden のまま）
        document.body.style.overflow = 'hidden';
    }
}

// 紙吹雪エフェクト
function createConfetti() {
    for (let i = 0; i < 30; i++) {
        const confetti = document.createElement('div');
        confetti.className = 'confetti';
        confetti.style.left = Math.random() * 100 + 'vw';
        confetti.style.background = ['var(--primary-yellow)', 'var(--primary-orange)', '#4ECDC4', '#45B7D1'][Math.floor(Math.random() * 4)];
        confetti.style.animationDelay = Math.random() * 2 + 's';
        document.body.appendChild(confetti);
        
        setTimeout(() => confetti.remove(), 3000);
    }
}

// 日付フォーマット関数
function formatDate(date) {
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${month}月${day}日`;
}

function formatTime(date) {
    const hours = date.getHours().toString().padStart(2, '0');
    const minutes = date.getMinutes().toString().padStart(2, '0');
    return `${hours}:${minutes}`;
}

// モーダル制御
function showModalWithScrollLock(modalId) {
    document.getElementById(modalId).style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(modalId) {
    document.getElementById(modalId).style.display = 'none';
    document.body.style.overflow = '';
}

// データ保存
function saveMedals() {
    localStorage.setItem('medals', JSON.stringify(medals));
    localStorage.setItem('nextId', nextId.toString());
}

// モーダル外クリックで閉じる
window.onclick = function(event) {
    const modals = document.querySelectorAll('.modal');
    modals.forEach(modal => {
        if (event.target === modal) {
            closeModal(modal.id);
        }
    });
}

// 初期化実行
init();

// Service Worker 登録（PWA対応）
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('./sw.js')
            .then((registration) => {
                console.log('Service Worker registered successfully:', registration.scope);
            })
            .catch((error) => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// PWAインストールプロンプト
let deferredPrompt;
window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    
    // インストールボタンを表示
    showInstallPrompt();
});

function showInstallPrompt() {
    // インストールプロンプトを表示する関数
    const installBanner = document.createElement('div');
    installBanner.id = 'installBanner';
    installBanner.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        right: 0;
        background: linear-gradient(135deg, var(--primary-orange), var(--primary-yellow));
        color: white;
        padding: 12px 20px;
        text-align: center;
        z-index: 1000;
        font-weight: bold;
        animation: slideDown 0.5s ease;
    `;
    installBanner.innerHTML = `
        <div style="display: flex; justify-content: space-between; align-items: center;">
            <span>📱 アプリをインストールして使いやすく！</span>
            <div>
                <button onclick="installApp()" style="background: white; color: var(--primary-orange); border: none; padding: 8px 16px; border-radius: 16px; font-weight: bold; margin-right: 8px; cursor: pointer;">インストール</button>
                <button onclick="closeInstallPrompt()" style="background: none; color: white; border: 1px solid white; padding: 8px 12px; border-radius: 16px; cursor: pointer;">✕</button>
            </div>
        </div>
    `;
    
    // アニメーション用CSS
    if (!document.getElementById('installAnimation')) {
        const style = document.createElement('style');
        style.id = 'installAnimation';
        style.textContent = `
            @keyframes slideDown {
                from { transform: translateY(-100%); }
                to { transform: translateY(0); }
            }
        `;
        document.head.appendChild(style);
    }
    
    document.body.appendChild(installBanner);
    
    // アプリコンテナの上マージンを調整
    document.querySelector('.app-container').style.marginTop = '60px';
}

function installApp() {
    if (deferredPrompt) {
        deferredPrompt.prompt();
        deferredPrompt.userChoice.then((choiceResult) => {
            if (choiceResult.outcome === 'accepted') {
                console.log('User accepted the install prompt');
            }
            deferredPrompt = null;
            closeInstallPrompt();
        });
    }
}

function closeInstallPrompt() {
    const banner = document.getElementById('installBanner');
    if (banner) {
        banner.remove();
        document.querySelector('.app-container').style.marginTop = '0';
    }
}

// アプリがインストールされた時の処理
window.addEventListener('appinstalled', (evt) => {
    console.log('App was installed');
    closeInstallPrompt();
});

// オフライン対応メッセージ
window.addEventListener('online', () => {
    console.log('アプリがオンラインになりました');
});

window.addEventListener('offline', () => {
    console.log('アプリがオフラインです');
    // オフライン時のメッセージ表示（オプション）
});