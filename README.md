# Stardew Valley Calculator

🌎 **[English](#english) | [Türkçe](#türkçe)**

---

## English

An interactive, responsive web application built with **React**, **Tailwind CSS**, and **Lucide Icons** to help Stardew Valley players compare processing profits between the **Keg** and **Preserves Jar** in real-time.

### 🌟 Key Features

*   **Searchable Combobox**: Easily search and select crops, forages, honey types, and fish roe.
*   **Quality Selector**: Supports crop quality inputs (Normal, Silver, Gold, Iridium) and automatically disables levels that aren't available for the selected item.
*   **Dynamic Pricing Formulas**: Recalculates raw sell prices and processed sell prices on-the-fly based on selected character professions:
    *   **Tiller**: Adds **+10%** (+1.10x) to the raw item price.
    *   **Artisan**: Adds **+40%** (+1.40x) to the processed artisan goods price.
*   **Side-by-Side Comparison**: Compares Keg vs. Preserves Jar profits and highlights the optimal processing machine with a soft green glowing outline. Handles non-processable items gracefully.
*   **9 NPC-Themed Palettes**: Change color schemes on-the-fly to match Stardew Valley characters (Default, Abigail, Sebastian, Emily, Leah, Penny, Robin, Sam, Lewis).
*   **Wiki Database View**: Switch tabs to browse all Keg and Preserves Jar statistics in a sortable, filterable wiki table style.
*   **Localized Switching**: Switch between English and Turkish; the app automatically translates labels and maps selected item names.
*   **Official Wiki Integration**: Dynamic external links redirect to the localized official Stardew Valley Wiki.

### 🚀 How to Run Locally

1.  Clone or navigate to the directory.
2.  Install dependencies:
    ```bash
    npm install
    ```
3.  Run the development server:
    ```bash
    npm run dev
    ```
4.  Open `http://localhost:5173/` in your browser.

---

## Türkçe

**React**, **Tailwind CSS** ve **Lucide Simgeleri** ile geliştirilmiş, Stardew Valley oyuncularının ürünleri **Fıçı** veya **Kavanozda** işlemenin kârlılığını yan yana karşılaştırmasını sağlayan etkileşimli web uygulaması.

### 🌟 Öne Çıkan Özellikler

*   **Aranabilir Seçim Kutusu**: Ürünleri, toplayıcılık ögelerini, bal türlerini ve balık yumurtalarını arayın ve kolayca seçin.
*   **Giriş Kalitesi Seçici**: Ürün kalitesini (Normal, Gümüş, Altın, İridyum) seçin. Seçilen ögede bulunmayan kalite seviyeleri otomatik olarak devre dışı kalır.
*   **Dinamik Kâr Hesaplama**: Karakter mesleklerine göre satış fiyatlarını gerçek zamanlı olarak yeniden hesaplar:
    *   **Filiz Kökleyici (Tiller)**: Ham ürün satış fiyatına **+%10** (+1.10x) ekler.
    *   **Zanaatkâr (Artisan)**: İşlenmiş zanaat ürünleri satış fiyatına **+%40** (+1.40x) ekler.
*   **Yan Yana Karşılaştırma**: Fıçı ve Kavanoz kârlarını karşılaştırıp en yüksek kâr sağlayan makineyi yeşil bir parıltıyla öne çıkarır.
*   **9 Farklı NPC Teması**: Arayüz renk paletini Stardew Valley karakterlerine göre değiştirin (Varsayılan Stardew, Abigail, Sebastian, Emily, Leah, Penny, Robin, Sam, Lewis).
*   **Wiki Veri Tabanı**: Arama filtreli ve sıralanabilir wiki tabloları üzerinden tüm Fıçı ve Kavanoz kâr oranlarını inceleyin.
*   **Çift Dil Desteği**: İngilizce ve Türkçe arasında anında geçiş yapın (seçili ürün otomatik olarak diğer dile eşlenir).
*   **Resmî Wiki Bağlantıları**: Aktif dile göre resmî Stardew Valley Wiki sayfasına doğrudan yönlendirme yapar.

### 🚀 Yerel Kurulum ve Çalıştırma

1.  Proje dizinine gidin.
2.  Gerekli paketleri kurun:
    ```bash
    npm install
    ```
3.  Geliştirici sunucusunu başlatın:
    ```bash
    npm run dev
    ```
4.  Tarayıcınızda `http://localhost:5173/` adresini açın.
