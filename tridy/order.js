document.addEventListener("DOMContentLoaded", function () {
    // Data voucher berdasarkan ID tombol
    const vouchers = {
      voucher4k: {
        nominal: "4.000",
        durasi: "12 jam"
      },
      voucher5k: {
        nominal: "5.000",
        durasi: "1 hari"
      },
      voucher15k: {
        nominal: "15.000",
        durasi: "3 hari"
      },
      voucher25k: {
        nominal: "25.000",
        durasi: "1 minggu"
      },
      voucher50k: {
        nominal: "50.000",
        durasi: "1 bulan"
      }
    };
  
    // Fungsi umum untuk handle klik voucher
    const handleVoucherClick = async (nominal, durasi) => {
      const result = await Swal.fire({
        title: "Pembayaran Manual",
        html: `
          <p> Silahkan bayar dengan QRIS dengan jumlah <strong>(IDR ${nominal})</strong></p>
          <p style="color: red; margin-top: 10px;">
            Setelah bayar, klik tombol di bawah untuk mengirim bukti transaksi (wajib)
          </p>
        `,
        imageAlt: "QRIS",
        showConfirmButton: true,
        imageUrl: "dist/images/paymentcode.jpeg",
        imageWidth: 200,
        imageHeight: 200,
        confirmButtonText: '<i class="fab fa-whatsapp"></i> Konfirmasi via WhatsApp',
        confirmButtonColor: "#25D366"
      });
  
      if (result.isConfirmed) {
        const nomorWA = "62811142114";
        const pesan = encodeURIComponent(`Halo, Saya ingin konfirmasi pembelian voucher ${durasi} sebesar ${nominal}`);
        const urlWA = `https://wa.me/${nomorWA}?text=${pesan}`;
        window.open(urlWA, "_blank");
      }
    };
  
    // Pasang event listener untuk semua voucher
    for (const id in vouchers) {
      const tombol = document.getElementById(id);
      if (tombol) {
        const { nominal, durasi } = vouchers[id];
        tombol.addEventListener("click", () => handleVoucherClick(nominal, durasi));
      }
    }
  });