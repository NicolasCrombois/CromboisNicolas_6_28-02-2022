function photographerFactory(data) {
    const { name, portrait, city, country, tagline, price, id } = data;

    const picture = `assets/photographers_profile_picture/${portrait}`;

    function getUserCardDOM() {
        const a = document.createElement( 'a' );
        a.href = `./photographer.html?id=${id}&name=${name}`
        const article = document.createElement( 'article' );
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.alt = name
        const h2 = document.createElement( 'h2' );
        h2.textContent = name;
        const h3 = document.createElement( 'h3' );
        h3.textContent = `${city}, ${country}`;
        const b = document.createElement( 'b' );
        b.textContent = tagline;
        const p = document.createElement( 'p' );
        p.textContent = `${price}€/jour`;
        a.appendChild(img);
        a.appendChild(h2);
        article.appendChild(a)
        article.appendChild(h3);
        article.appendChild(b);
        article.appendChild(p);
        return (article);
    }
    function getUserInformation() {
        const div = document.createElement( 'div' );
        div.className = "information-photographer"
        const h2 = document.createElement( 'h2' );
        h2.innerHTML = name;
        const h3 = document.createElement( 'h3' );
        h3.innerHTML = `${city}, ${country}`;
        const p = document.createElement( 'p' );
        p.innerHTML = tagline;
        div.appendChild(h2);
        div.appendChild(h3);
        div.appendChild(p);
        return (div);
    }
    function getUserPicture() {
        const img = document.createElement( 'img' );
        img.setAttribute("src", picture)
        img.alt = name
        return (img);
    }
    function getBannerPriceLikePhotographer() {
        const div = document.createElement( 'div' );
        const like = document.createElement( 'p' );
        const p = document.createElement( 'p' );

        div.id = "likeAndPrice"
        like.id = "totalLike"

        p.textContent = `${price}€/jour`;

        div.appendChild(like);
        div.appendChild(p);

        return div;
    }
    return { getUserCardDOM, getUserInformation, getUserPicture, getBannerPriceLikePhotographer }
}