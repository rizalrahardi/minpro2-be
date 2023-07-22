pas pertama clone setup .env sesuai database yaaa, udah ada .env-template tinggal buat file .env dan sesuaikan dg templatenya oke!  
abis itu untuk controller kita pisah folder untuk tiap fiturnya seperti authentication, blog dan profile, jadi nanti kalo mau buat controller di sesuaikan ya dengan foldernya  
oiya ada folder services di src itu dipakai buat simpan function yg nanti kita pakai di controller jadi flownya kurang lebih = services=>controller=>routes  
jadi dari function yg kita buat di services nanti kita panggil dan kita tinggal taruh di controller supaya   mengurani lines of code ya tau sendirilah requirementnya
untuk routes juga kita bagi per file jadi nanti kalau sudah dibuat controllernya tinggal sesuaikan ya taruh di file router apa  
terakhir kalau ada yang salah, kurang atau gak jelas bisa tanya cs andre  
oiya nanti setelah clone atau download pastikan sebelum di push buat branch baru kasih nama sesuai fiturnya biar ga langsung ke master  
  
cara buat branch di terminal:    
git checkout -b nama branch  
contoh : git checkout -b andre  
flow git =>  
git checkout -b andre  
git add .  
git commit -m "initial commit"  
git push origin andre  
  
untuk push sesuaikan dengan nama branch jangan sampai di push ke master  
  
  
  
bingung yaaa??  
 

ttd  
besti beliau  