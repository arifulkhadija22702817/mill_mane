const predefinedMembers = [
    "জাহিরুল",
    "বিজয়",
    "মান্না",
    "শাকিল",
    "বিশাল",
    "আয়নুল",
    "পুলক",
    "মামুন",
    "দুলু",
    "মাহফুজ",
    "সাব্বির",
    "নাসিফ নুর",
    "আব্দুর রহমান",
    "মোল্লা",
    "মোমিন",
    "লাবিব",
    "আলামিন",
    "মিঠু",
    "রেজা-২",
    "তিয়াস",
    "নাহিদ",
    "নাফিস",
    "রাব্বি-২",
    "ফরহাদ",
    "ফজলে রাব্বি",
    "আরাফাত",
    "রিফাত",
    "আরিফুল",
    "ফাহিম",
    "হামিম",
    "জয়",
    "ফারুক",
    "মারুফ",
    "রুপম",
    "নাঈম",
    "মাহমুদুল",
    "লক্ষিন্দ্র",
    "মনির",
    "রাসেল",
    "সাকিব",
    "রাদিব",
    "মমিনুল",
    "আলিফ",
    "দিনার",
    "অপুল",
    "হাবিব",
    "সিয়াদ",
    "রিয়াদ",
    "নাসিফ-২",
    "রেজা-১"
];
function loadFromMongo() {

    fetch("http://localhost:5000/members")
        .then(res => res.json())
        .then(data => {
            if (data && data.length) {
                members = data;
                updateTable();
            }
        })
        .catch(() => { });

}


// প্রাথমিক ডেটা - প্রি-ডিফাইন্ড সদস্যরা লোড করুন
let members = JSON.parse(localStorage.getItem('members')) || [];

// যদি লোকাল স্টোরেজে কোন ডেটা না থাকে, প্রি-ডিফাইন্ড সদস্য লোড করুন
if (members.length === 0) {
    members = predefinedMembers.map(name => ({
        name: name,
        fineMeals: 0,
        presentMeals: 0,
        presentExtra: 0,
        guestMeals: 0,
        deposit: 0,
        paid: false // নতুন ফিল্ড: পরিশোধ স্ট্যাটাস
    }));
    saveAllData();
}

let currentDate = new Date().toISOString().split('T')[0];

// DOM এলিমেন্ট
const dateInput = document.getElementById('date');
const managerInput = document.getElementById('manager');
const smallMarketInput = document.getElementById('small-market');
const bigMarketInput = document.getElementById('big-market');
const totalMealsInput = document.getElementById('total-meals');
const milRateDisplay = document.getElementById('mil-rate');
const tableBody = document.getElementById('table-body');
const saveBtn = document.getElementById('save-btn');
const addMemberBtn = document.getElementById('add-member-btn');
const excelBtn = document.getElementById('excel-btn');
const pdfBtn = document.getElementById('pdf-btn');
const resetBtn = document.getElementById('reset-btn');
const totalMembersSpan = document.getElementById('total-members');
const summaryTotalPresentMealsSpan = document.getElementById('summary-total-present-meals');
const summaryTotalFineMealsSpan = document.getElementById('summary-total-fine-meals');
const summaryTotalGuestMealsSpan = document.getElementById('summary-total-guest-meals');
const summaryTotalDepositSpan = document.getElementById('summary-total-deposit');
const summaryTotalExpenseSpan = document.getElementById('summary-total-expense');
const summaryPaidMembersSpan = document.getElementById('summary-paid-members');
const summaryDueMembersSpan = document.getElementById('summary-due-members');
const summaryTotalReturnSpan = document.getElementById('summary-total-return');
const summaryTotalManagerSpan = document.getElementById('summary-total-manager');


// প্রিন্ট ইনফো এলিমেন্ট
const printInfo = document.getElementById('print-info');
const printDate = document.getElementById('print-date');
const printManager = document.getElementById('print-manager');
const printSmallMarket = document.getElementById('print-small-market');
const printBigMarket = document.getElementById('print-big-market');
const printTotalMeals = document.getElementById('print-total-meals');
const printMilRate = document.getElementById('print-mil-rate');

// থিম সিস্টেম
const themeButtons = document.querySelectorAll('.theme-btn');
const body = document.body;

// তারিখ সেট করুন
dateInput.value = currentDate;

// লোকাল স্টোরেজ থেকে মৌলিক তথ্য লোড করার ফাংশন
function loadBasicInfoFromLocalStorage() {
    const savedDate = localStorage.getItem('basicInfo_date');
    const savedManager = localStorage.getItem('basicInfo_manager');
    const savedSmallMarket = localStorage.getItem('basicInfo_smallMarket');
    const savedBigMarket = localStorage.getItem('basicInfo_bigMarket');
    const savedTotalMeals = localStorage.getItem('basicInfo_totalMeals');

    if (savedDate) dateInput.value = savedDate;
    if (savedManager) managerInput.value = savedManager;
    if (savedSmallMarket) smallMarketInput.value = savedSmallMarket;
    if (savedBigMarket) bigMarketInput.value = savedBigMarket;
    if (savedTotalMeals) totalMealsInput.value = savedTotalMeals;

    // মিল রেট ক্যালকুলেশন করুন
    calculateMilRate();
}

// লোকাল স্টোরেজে মৌলিক তথ্য সেভ করার ফাংশন
function saveBasicInfoToLocalStorage() {
    localStorage.setItem('basicInfo_date', dateInput.value);
    localStorage.setItem('basicInfo_manager', managerInput.value);
    localStorage.setItem('basicInfo_smallMarket', smallMarketInput.value);
    localStorage.setItem('basicInfo_bigMarket', bigMarketInput.value);
    localStorage.setItem('basicInfo_totalMeals', totalMealsInput.value);
}

// থিম পরিবর্তন ফাংশন
function changeTheme(themeName) {
    // সব থিম ক্লাস সরান
    body.classList.remove('theme-dark', 'theme-blue', 'theme-green', 'theme-purple');

    // নতুন থিম ক্লাস যোগ করুন
    if (themeName !== 'light') {
        body.classList.add(`theme-${themeName}`);
    }

    // সক্রিয় থিম বাটন আপডেট করুন
    themeButtons.forEach(btn => {
        if (btn.getAttribute('data-theme') === themeName) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // লোকাল স্টোরেজে থিম সংরক্ষণ করুন
    localStorage.setItem('selectedTheme', themeName);
}

// থিম বাটনে ইভেন্ট যোগ করুন
themeButtons.forEach(button => {
    button.addEventListener('click', () => {
        const theme = button.getAttribute('data-theme');
        changeTheme(theme);
    });
});

// লোকাল স্টোরেজ থেকে থিম লোড করুন
const savedTheme = localStorage.getItem('selectedTheme') || 'light';
changeTheme(savedTheme);

// প্রিন্ট ইনফো আপডেট ফাংশন
function updatePrintInfo() {
    const date = dateInput.value || '-';
    const manager = managerInput.value || '-';
    const smallMarket = smallMarketInput.value || '0';
    const bigMarket = bigMarketInput.value || '0';
    const totalMeals = totalMealsInput.value || '0';
    const milRate = milRateDisplay.textContent || '0.00';

    // তারিখ ফরম্যাট করুন
    const formattedDate = date !== '-' ? new Date(date).toLocaleDateString('en-GB') : '-';

    printDate.textContent = formattedDate;
    printManager.textContent = manager;
    printSmallMarket.textContent = smallMarket !== '0' ? `${parseInt(smallMarket).toLocaleString('en-US')} TK` : '-';
    printBigMarket.textContent = bigMarket !== '0' ? `${parseInt(bigMarket).toLocaleString('en-US')} TK` : '-';
    printTotalMeals.textContent = totalMeals !== '0' ? parseInt(totalMeals).toLocaleString('en-US') : '-';
    printMilRate.textContent = milRate !== '0.00' ? `${parseFloat(milRate).toFixed(2)} TK` : '-';

    // যদি কোনো ডেটা থাকে তবে প্রিন্ট ইনফো দেখান
    if (date !== '-' || manager !== '-' || smallMarket !== '0' || bigMarket !== '0' || totalMeals !== '0') {
        printInfo.classList.add('show');
    } else {
        printInfo.classList.remove('show');
    }
}

// মিল রেট ক্যালকুলেশন
function calculateMilRate() {
    const smallMarket = parseFloat(smallMarketInput.value) || 0;
    const bigMarket = parseFloat(bigMarketInput.value) || 0;
    const totalMeals = parseFloat(totalMealsInput.value) || 1; // শূন্য দ্বারা বিভাজন এড়াতে

    const milRate = (smallMarket + bigMarket) / totalMeals;
    milRateDisplay.textContent = milRate.toFixed(2) + ' TK';

    // মিল রেট পরিবর্তন হলে টেবিল আপডেট করুন
    updateTable();
    // প্রিন্ট ইনফো আপডেট করুন
    updatePrintInfo();
}

// ইভেন্ট লিসেনার যোগ করুন
dateInput.addEventListener('input', () => {
    saveBasicInfoToLocalStorage();
    updatePrintInfo();
});

managerInput.addEventListener('input', () => {
    saveBasicInfoToLocalStorage();
    updatePrintInfo();
});

smallMarketInput.addEventListener('input', () => {
    saveBasicInfoToLocalStorage();
    calculateMilRate();
});

bigMarketInput.addEventListener('input', () => {
    saveBasicInfoToLocalStorage();
    calculateMilRate();
});

totalMealsInput.addEventListener('input', () => {
    saveBasicInfoToLocalStorage();
    calculateMilRate();
});

// টেবিল আপডেট ফাংশন
function updateTable() {
    tableBody.innerHTML = '';
    let totalReturnAmount = 0;
    let totalManagerGets = 0;
    let totalPresentMeals = 0;
    let totalFineMeals = 0;
    let totalGuestMeals = 0;
    let totalDeposit = 0;
    let totalExpense = 0;
    let paidMembers = 0;
    let dueMembers = 0;

    members.forEach((member, index) => {
        const fineMeals = member.fineMeals || 0;
        const presentMeals = member.presentMeals || 0;
        const presentExtra = member.presentExtra || 0;
        const guestMeals = member.guestMeals || 0;
        const deposit = member.deposit || 0;
        const paid = member.paid || false;
        const milRate = parseFloat(milRateDisplay.textContent) || 0;

        // মোট ব্যয়িত মিল = প্রেজেন্ট মিল + জরিমানা মিল
        const totalConsumedMeals = presentMeals + fineMeals;

        // গেস্ট মিল খরচ (প্রতি গেস্ট মিল = 100 টাকা)
        const guestExpense = guestMeals * 120;

        // মিল খরচ = (প্রেজেন্ট মিল + জরিমানা মিল) × মিল রেট
        const mealExpense = totalConsumedMeals * milRate;

        // মোট ব্যয় = মিল খরচ + গেস্ট মিল খরচ
        const expense = mealExpense + guestExpense + presentExtra;

        const returnAmount = Math.max(0, deposit - expense);
        const managerGets = Math.max(0, expense - deposit);
        totalReturnAmount += returnAmount;
        totalManagerGets += managerGets;


        // হাইলাইট কন্ডিশন চেক করুন
        const shouldHighlight = managerGets > 0;

        totalPresentMeals += presentMeals;
        totalFineMeals += fineMeals;
        totalGuestMeals += guestMeals;
        totalDeposit += deposit;
        totalExpense += expense;

        if (paid) {
            paidMembers++;
        } else {
            dueMembers++;
        }

        const row = document.createElement('tr');
        row.innerHTML = `
                    <td class="name-cell editable ${shouldHighlight ? 'highlight-name' : ''}" data-index="${index}" data-field="name">${member.name || 'নতুন সদস্য'}</td>
                    <td class="number-cell editable fine-cell" data-index="${index}" data-field="fineMeals">${fineMeals}</td>
                    <td class="number-cell editable" data-index="${index}" data-field="presentMeals">${presentMeals}</td>
                    <td class="number-cell editable" data-index="${index}" data-field="presentExtra">${presentExtra}</td>
                    <td class="number-cell editable" data-index="${index}" data-field="guestMeals">${guestMeals}</td>
                    <td class="number-cell">${totalConsumedMeals}</td>
                    <td class="number-cell editable" data-index="${index}" data-field="deposit">${deposit}</td>
                    <td class="number-cell">${expense.toFixed(2)}</td>
                    <td class="number-cell return-cell">${returnAmount.toFixed(2)}</td>
                    <td class="number-cell">${managerGets.toFixed(2)}</td>
                    <td class="number-cell">
                        <span class="paid-indicator ${paid ? 'paid' : ''}" data-index="${index}"></span>
                        ${paid ? 'পরিশোধিত' : 'বকেয়া'}
                    </td>
                    <td class="number-cell">
                        <button class="delete-btn" data-index="${index}">ডিলিট</button>
                    </td>
                `;
        tableBody.appendChild(row);

    });

    // সারাংশ আপডেট করুন
    totalMembersSpan.textContent = members.length;
    summaryTotalPresentMealsSpan.textContent = totalPresentMeals;
    summaryTotalFineMealsSpan.textContent = totalFineMeals;
    summaryTotalGuestMealsSpan.textContent = totalGuestMeals;
    summaryTotalDepositSpan.textContent = totalDeposit.toFixed(2);
    summaryTotalExpenseSpan.textContent = totalExpense.toFixed(2);
    summaryPaidMembersSpan.textContent = paidMembers;
    summaryDueMembersSpan.textContent = dueMembers;
    summaryTotalReturnSpan.textContent = totalReturnAmount.toFixed(2);
    summaryTotalManagerSpan.textContent = totalManagerGets.toFixed(2);

}






// ইডিটেবল সেল ক্লিক ইভেন্ট
tableBody.addEventListener('click', (e) => {
    if (e.target.classList.contains('editable')) {
        const index = e.target.getAttribute('data-index');
        const field = e.target.getAttribute('data-field');
        const currentValue = e.target.textContent;

        // যদি নাম ফিল্ড হয়
        if (field === 'name') {
            const newName = prompt('নাম লিখুন:', currentValue);
            if (newName !== null && newName.trim() !== '') {
                members[index][field] = newName.trim();
                updateTable();
                saveAllData();
            }
        }
        // যদি সংখ্যাসূচক ফিল্ড হয়
        else {
            const newValue = prompt('মান লিখুন:', currentValue);
            if (newValue !== null) {
                const numValue = parseFloat(newValue) || 0;
                members[index][field] = numValue;
                updateTable();
                saveAllData();
            }
        }
    }

    // পরিশোধ স্ট্যাটাস টগল করুন
    if (e.target.classList.contains('paid-indicator')) {
        const index = e.target.getAttribute('data-index');
        members[index].paid = !members[index].paid;


        saveAllData();


        updateTable();

    }

    // ডিলিট বাটন
    if (e.target.classList.contains('delete-btn')) {
        const index = e.target.getAttribute('data-index');
        if (confirm('আপনি কি এই সদস্যকে ডিলিট করতে চান?')) {
            members.splice(index, 1);
            updateTable();
            saveAllData();
        }
    }
});

// নতুন সদস্য যোগ করুন
addMemberBtn.addEventListener('click', () => {
    const newName = prompt('নতুন সদস্যের নাম লিখুন:');
    if (newName !== null && newName.trim() !== '') {
        members.push({
            name: newName.trim(),
            fineMeals: 0,
            presentMeals: 0,
            presentExtra: 0,
            guestMeals: 0,
            deposit: 0,
            paid: false
        });
        updateTable();
        saveAllData();
    }
});

// ডেটা সেভ করুন
saveBtn.addEventListener('click', () => {
    saveAllData();
    saveBasicInfoToLocalStorage();
    alert('ডেটা সফলভাবে সেভ হয়েছে!');
});

// এক্সেল ডাউনলোড
excelBtn.addEventListener('click', () => {
    // মিল রেট পান
    const milRate = parseFloat(milRateDisplay.textContent.replace('TK', '')) || 0;

    // এক্সেল ডেটা প্রস্তুত করুন
    const excelData = [
        ['মিলের হিসাব রিপোর্ট'],
        ['তারিখ:', dateInput.value || '-'],
        ['ম্যানেজার:', managerInput.value || '-'],
        ['ছোট বাজার:', smallMarketInput.value || '0'],
        ['বড় বাজার:', bigMarketInput.value || '0'],
        ['মোট মিল:', totalMealsInput.value || '0'],
        ['মিল রেট:', milRate.toFixed(2)],
        [], // খালি সারি
        ['নাম', 'জরিমানা মিল', 'প্রেজেন্ট মিল', 'ধার/এক্সট্রা (৳)', 'গেস্ট মিল', 'মোট ব্যয়িত মিল', 'জমা টাকা', 'ব্যয় টাকা', 'ফেরত টাকা', 'ম্যানেজার পাবে', 'পরিশোধ স্ট্যাটাস']
    ];

    // সদস্য ডেটা যোগ করুন
    members.forEach(member => {
        const fineMeals = member.fineMeals || 0;
        const presentMeals = member.presentMeals || 0;
        const presentExtra = member.presentExtra || 0;
        const guestMeals = member.guestMeals || 0;
        const deposit = member.deposit || 0;
        const paid = member.paid ? 'পরিশোধিত' : 'বকেয়া';

        // মোট ব্যয়িত মিল = প্রেজেন্ট মিল + জরিমানা মিল
        const totalConsumedMeals = presentMeals + fineMeals;

        // গেস্ট মিল খরচ (প্রতি গেস্ট মিল = 120 টাকা)
        const guestExpense = guestMeals * 120;

        // মিল খরচ = (প্রেজেন্ট মিল + জরিমানা মিল) × মিল রেট
        const mealExpense = totalConsumedMeals * milRate;

        // মোট ব্যয় = মিল খরচ + গেস্ট মিল খরচ
        const expense = mealExpense + guestExpense + presentExtra;
        const returnAmount = Math.max(0, deposit - expense);
        const managerGets = Math.max(0, expense - deposit);

        excelData.push([
            member.name,
            fineMeals,
            presentMeals,
            presentExtra,
            guestMeals,
            totalConsumedMeals,
            deposit,
            expense.toFixed(2),
            returnAmount.toFixed(2),
            managerGets.toFixed(2),
            paid
        ]);
    });

    // ওয়ার্কবুক তৈরি করুন
    const ws = XLSX.utils.aoa_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "মিলের হিসাব");

    // এক্সেল ফাইল ডাউনলোড করুন
    const fileName = `mil_hisab_${dateInput.value || 'report'}.xlsx`;
    XLSX.writeFile(wb, fileName);
});

// PDF প্রিন্ট
pdfBtn.addEventListener('click', () => {
    // প্রিন্ট ইনফো আপডেট করুন
    updatePrintInfo();

    // প্রিন্ট ডায়ালগ খুলুন
    window.print();
});

// রিসেট বাটন
resetBtn.addEventListener('click', () => {
    if (confirm('আপনি কি নিশ্চিত যে আপনি সব ডেটা রিসেট করতে চান? এটি পূর্বের সব ডেটা মুছে ফেলবে।')) {
        // প্রি-ডিফাইন্ড সদস্য লোড করুন
        members = predefinedMembers.map(name => ({
            name: name,
            fineMeals: 0,
            presentMeals: 0,
            presentExtra: 0,
            guestMeals: 0,
            deposit: 0,
            paid: false
        }));

        // ইনপুট ফিল্ড রিসেট করুন
        dateInput.value = currentDate;
        managerInput.value = '';
        smallMarketInput.value = '';
        bigMarketInput.value = '';
        totalMealsInput.value = '';

        // লোকাল স্টোরেজ আপডেট করুন
        saveAllData();

        // মৌলিক তথ্য লোকাল স্টোরেজ থেকে ডিলিট করুন
        localStorage.removeItem('basicInfo_date');
        localStorage.removeItem('basicInfo_manager');
        localStorage.removeItem('basicInfo_smallMarket');
        localStorage.removeItem('basicInfo_bigMarket');
        localStorage.removeItem('basicInfo_totalMeals');

        // টেবিল আপডেট করুন
        updateTable();


        // মিল রেট রিসেট করুন
        milRateDisplay.textContent = '0.00';

        // প্রিন্ট ইনফো লুকান
        printInfo.classList.remove('show');

        alert('ডেটা রিসেট করা হয়েছে!');
    }
});

// প্রাথমিক টেবিল আপডেট
updateTable();
updatePrintInfo();
loadBasicInfoFromLocalStorage();
/************ PUBLIC LOCK ************/



function saveAllData() {

    // LocalStorage এ save
    localStorage.setItem('members', JSON.stringify(members));

    // 👉 MongoDB তে পাঠাবে
    fetch("http://localhost:5000/saveMembers", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(members)
    }).catch(() => { });

}


setTimeout(loadFromMongo, 300);