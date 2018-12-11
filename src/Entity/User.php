<?php

namespace App\Entity;

use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Bridge\Doctrine\Validator\Constraints\UniqueEntity;

/**
 * @ORM\Entity(repositoryClass="App\Repository\UserRepository")
 * @UniqueEntity("username", message="Ce nom d'utilisateur existe déja")
 */
class User implements UserInterface
{
    /**
     * @ORM\Id()
     * @ORM\GeneratedValue()
     * @ORM\Column(type="integer")
     */
    private $id;

    /**
     * @ORM\Column(type="string", length=20)
     * @Assert\NotBlank(
     *      message="Saississez votre nom d'utilisateur")
     * @Assert\Length(
     *      min = 3,
     *      max = 20,     
     *      minMessage = "Minimum {{ minLimit }} caratères",
     *      minMessage = "Maximum {{ maxLimit }} caratères", 
     * )
     */
    private $username;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *      message="Saississez votre adresse mail")
     * @Assert\Email(
     *     message = "L'email '{{ value }}' n'est pas valide.",
     *     checkMX = true
     * )
     */
    private $email;

    /**
     * @ORM\Column(type="string", length=255)
     * @Assert\NotBlank(
     *      message="Saississez votre mot de passe")
     * @Assert\Regex(
     *      pattern= "/^(?=.*\d).{6,}$/",     *      
     *      message="Minimum 6 caratères et au moins 1 chiffre"
     *)
     */
    private $password;

    private $plainPassword;

    /**
     * @ORM\Column(type="array")
     */
    private $roles = [];

    /**
     * @ORM\OneToMany(targetEntity="App\Entity\Save", mappedBy="user")
     */
    private $saves;

    public function __construct()
    {
        $this->saves = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getUsername(): ?string
    {
        return $this->username;
    }

    public function setUsername(string $username): self
    {
        $this->username = $username;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): self
    {
        $this->email = $email;

        return $this;
    }

    public function getPassword(): ?string
    {
        return $this->password;
    }

    public function setPassword(string $password): self
    {
        $this->password = $password;

        return $this;
    }

    public function getRoles(): ?array
    {
        return $this->roles;
    }

    public function setRoles(array $roles): self
    {
        $this->roles = $roles;

        return $this;
    }

    /**
     * @return Collection|Save[]
     */
    public function getSaves(): Collection
    {
        return $this->saves;
    }

    public function addSafe(Save $safe): self
    {
        if (!$this->saves->contains($safe)) {
            $this->saves[] = $safe;
            $safe->setUser($this);
        }

        return $this;
    }

    public function removeSafe(Save $safe): self
    {
        if ($this->saves->contains($safe)) {
            $this->saves->removeElement($safe);
            // set the owning side to null (unless already changed)
            if ($safe->getUser() === $this) {
                $safe->setUser(null);
            }
        }

        return $this;
    }

    /**
     * Get the value of plainPassword
     */ 
    public function getPlainPassword()
    {
        return $this->plainPassword;
    }

    /**
     * Set the value of plainPassword
     *
     * @return  self
     */ 
    public function setPlainPassword($plainPassword)
    {
        $this->plainPassword = $plainPassword;

        return $this;
    }

    public function eraseCredentials()
    {
        
    }

    public function getSalt(): ?string
    {
        return null;
    }
}
