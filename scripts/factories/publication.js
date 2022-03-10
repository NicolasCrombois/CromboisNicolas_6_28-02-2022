function publicationFactory(data) {
    const { id, photographerId, title, image, video, likes, date, price} = data;

    function getPublicationCardDOM() {
        const article = document.createElement( 'article' );
        const div = document.createElement( 'div' );
        const h2 = document.createElement( 'h2' );
        const p = document.createElement( 'p' );
        const i = document.createElement( 'i' );

        article.classList.add('publication');
        i.classList.add('fa-solid','fa-heart');
        div.classList.add('information-publication');
        
        h2.textContent = title;
        p.textContent = `${likes} `;

        if(image){
            const img = document.createElement( 'img' );
            img.setAttribute("src", `assets/photographers/${photographerId}/${image}`)
            img.alt = title
            article.appendChild(img)
        }else if(video){
            const movie = document.createElement( 'video' );
            const source = document.createElement( 'source' );
            source.setAttribute("src", `assets/photographers/${photographerId}/${video}`);
            source.setAttribute("type", `video/`+video.split(".").pop());
            movie.appendChild(source)
            article.appendChild(movie)
        }

        p.appendChild(i);
        div.appendChild(h2);
        div.appendChild(p);
        article.appendChild(div);
        return (article);
    }
    
    return { getPublicationCardDOM}
}